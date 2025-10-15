"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
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
  const [errors, setErrors] = useState<Record<number, string>>({}); // categoryId -> error

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
      setErrors({});
    }
  }, [isOpen, productSlug]);

  // 🧹 Ensure selection is cleared on close as well
  useEffect(() => {
    if (!isOpen) {
      setSelection([]);
      setErrors({});
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isLoading, isError, uiCategories.length]);

  // 🛡️ Validation
  const buildErrors = useCallback((): Record<number, string> => {
    const errs: Record<number, string> = {};
    for (const cat of uiCategories) {
      const sel =
        selection.find((s) => s.categoryId === cat.id) ??
        ({
          categoryId: cat.id,
          addonId: null,
          optionIds: [],
          customName: null,
        } as SelectedAddonForCategory);

      // 1) Require an addon for each category
      if (!sel.addonId) {
        errs[cat.id] = isArabic
          ? "يرجى اختيار إضافة لهذا القسم."
          : "Please select an addon for this category.";
        continue;
      }

      const addon = cat.addons.find((a) => a.id === sel.addonId);
      if (!addon) {
        errs[cat.id] = isArabic
          ? "الإضافة المحددة غير صالحة."
          : "Selected addon is invalid.";
        continue;
      }

      // 2) Custom name if required
      if (addon.requires_custom_name) {
        if (!sel.customName || !sel.customName.trim()) {
          errs[cat.id] = isArabic
            ? "هذا الخيار يتطلب اسمًا مخصصًا."
            : "This addon requires a custom name.";
          continue;
        }
      }

      // 3) Options validation
      if (addon.options.length > 0) {
        if (addon.allow_multiple_options) {
          // require at least 1
          if (!sel.optionIds || sel.optionIds.length < 1) {
            errs[cat.id] = isArabic
              ? "يرجى اختيار خيار واحد على الأقل."
              : "Please choose at least one option.";
            continue;
          }
        } else {
          // radio → exactly 1
          if (!sel.optionIds || sel.optionIds.length !== 1) {
            errs[cat.id] = isArabic
              ? "يرجى اختيار خيار واحد فقط."
              : "Please choose exactly one option.";
            continue;
          }
        }
      }
      // else: no options -> no option validation
    }
    return errs;
  }, [selection, uiCategories, isArabic]);

  // Validate live whenever selection/categories change
  useEffect(() => {
    setErrors(buildErrors());
  }, [buildErrors]);

  const handleConfirm = () => {
    const currentErrors = buildErrors();
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      // Don't close; show inline errors
      return;
    }
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
              errors={errors} // 🔴 show per-category errors
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
            isDisabled={isError || Object.keys(errors).length > 0} // 🧷 block if invalid
          >
            {t.confirm}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
