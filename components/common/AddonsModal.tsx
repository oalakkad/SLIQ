"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";
import { useProductAddons } from "@/hooks/use-product-addons";
import AddonsSelector, {
  SelectedAddonForCategory,
  AddonCategory as UIAddonCategory,
} from "@/components/common/AddonSelector";
import { useAppSelector } from "@/redux/hooks";

interface AddonsPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productSlug: string;
  onConfirm: (selection: SelectedAddonForCategory[]) => void;
  title?: string;
}

export default function AddonsModal({
  isOpen,
  onClose,
  productSlug,
  onConfirm,
  title,
}: AddonsPickerModalProps) {
  const isArabic = useAppSelector((s) => s.lang.isArabic);

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const { data, isLoading, isError } = useProductAddons(productSlug);

  const [selection, setSelection] = useState<SelectedAddonForCategory[]>([]);

  // Map API response into UI shape based on language (memoized)
  const uiCategories: UIAddonCategory[] = useMemo(
    () =>
      (data || []).map((cat) => ({
        id: cat.id,
        name: isArabic && cat.name_ar ? cat.name_ar : cat.name,
        name_ar: cat.name_ar,
        addons: cat.addons.map((a) => ({
          id: a.id,
          name: isArabic && a.name_ar ? a.name_ar : a.name,
          name_ar: a.name_ar,
          price: Number(a.price || "0"),
          allow_multiple_options: a.allow_multiple_options,
          requires_custom_name: a.requires_custom_name,
          options: a.options.map((o) => ({
            id: o.id,
            name: isArabic && o.name_ar ? o.name_ar : o.name,
            name_ar: o.name_ar,
            price: Number(o.price || "0"),
          })),
        })),
      })) || [],
    [data, isArabic]
  );

  // 🔄 Always start with a fresh selection on open or when switching product
  useEffect(() => {
    if (isOpen) {
      setSelection([]);
    }
  }, [isOpen, productSlug]);

  // 🧹 Ensure selection is cleared on close as well
  useEffect(() => {
    if (!isOpen) {
      setSelection([]);
    }
  }, [isOpen]);

  // 🔒 Auto-confirm when there are no categories (once per open)
  const firedAutoConfirmRef = useRef(false);

  // Reset guard whenever modal closes
  useEffect(() => {
    if (!isOpen) firedAutoConfirmRef.current = false;
  }, [isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      !isLoading &&
      !isError &&
      uiCategories.length === 0 &&
      !firedAutoConfirmRef.current
    ) {
      firedAutoConfirmRef.current = true;
      // Explicitly confirm with an empty selection and clear local state
      setSelection([]);
      onConfirm([]);
      onClose();
    }
    // We intentionally avoid adding onConfirm/onClose/selection to deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoading, isError, uiCategories.length]);

  const handleConfirm = () => {
    onConfirm(selection);
    onClose();
  };

  // ❌ Prevent flash: only render after loading, and only if we have something to show (error or categories)
  const shouldRenderModal =
    isOpen && !isLoading && (isError || uiCategories.length > 0);

  if (!shouldRenderModal) return null;

  const t = {
    title: title || (isArabic ? "خصص طلبك" : "Customize your item"),
    error: isArabic
      ? "فشل تحميل الإضافات. يرجى المحاولة مرة أخرى."
      : "Failed to load addons. Please try again.",
    cancel: isArabic ? "إلغاء" : "Cancel",
    confirm: isArabic ? "أضف إلى السلة" : "Add to cart",
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent dir={isArabic ? "rtl" : "ltr"}>
        <ModalHeader textAlign="center">{t.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isError && (
            <Text color="red.500" textAlign={isArabic ? "right" : "left"}>
              {t.error}
            </Text>
          )}

          {!isError && uiCategories.length > 0 && (
            <AddonsSelector
              categories={uiCategories}
              showPrices
              onChange={setSelection}
              isArabic={isArabic}
            />
          )}
        </ModalBody>

        <ModalFooter justifyContent={"center"}>
          <Button
            variant="ghost"
            mr={isArabic ? 0 : 3}
            ml={isArabic ? 3 : 0}
            py={6}
            onClick={onClose}
          >
            {t.cancel}
          </Button>
          <Button
            variant={"solidBlue"}
            onClick={handleConfirm}
            fontFamily={headingFont}
            px={10}
            py={6}
            isDisabled={isError}
          >
            {t.confirm}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
