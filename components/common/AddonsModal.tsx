"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Spinner,
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
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";
  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const { data, isLoading, isError } = useProductAddons(productSlug);
  const [selection, setSelection] = useState<SelectedAddonForCategory[]>([]);

  const handleConfirm = () => {
    onConfirm(selection);
    onClose();
  };

  // Map API response into UI shape based on language
  const uiCategories: UIAddonCategory[] =
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
    })) || [];

  // Translations for static text
  const t = {
    title: title || (isArabic ? "خصص طلبك" : "Customize your item"),
    loading: isArabic ? "جارٍ التحميل..." : "Loading...",
    error: isArabic
      ? "فشل تحميل الإضافات. يرجى المحاولة مرة أخرى."
      : "Failed to load addons. Please try again.",
    noAddons: isArabic
      ? "لا توجد إضافات متاحة لهذا المنتج."
      : "No addons available for this product.",
    cancel: isArabic ? "إلغاء" : "Cancel",
    confirm: isArabic ? "أضف إلى السلة" : "Add to cart",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent dir={isArabic ? "rtl" : "ltr"}>
        <ModalHeader textAlign={"center"}>{t.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading && (
            <Box py={6} display="flex" justifyContent="center">
              <Spinner />
              <Text ml={isArabic ? 0 : 2} mr={isArabic ? 2 : 0}>
                {t.loading}
              </Text>
            </Box>
          )}

          {isError && !isLoading && (
            <Text color="red.500" textAlign={isArabic ? "right" : "left"}>
              {t.error}
            </Text>
          )}

          {!isLoading && !isError && uiCategories.length === 0 && (
            <Text color="gray.600" textAlign={isArabic ? "right" : "left"}>
              {t.noAddons}
            </Text>
          )}

          {!isLoading && !isError && uiCategories.length > 0 && (
            <AddonsSelector
              categories={uiCategories}
              showPrices
              onChange={setSelection}
              isArabic={isArabic} // if AddonsSelector supports RTL/Arabic handling
            />
          )}
        </ModalBody>

        <ModalFooter>
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
            bg={"gray.600"}
            color={"white"}
            _hover={{ backgroundColor: "gray.500", color: "white" }}
            onClick={handleConfirm}
            fontFamily={headingFont}
            px={10}
            py={6}
            isDisabled={isLoading || isError}
          >
            {t.confirm}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
