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
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select, { MultiValue } from "react-select";

import {
  AdminAddonCategory,
  useAdminAddonCategories,
  useAllProductCategories,
  useLinkedProductCategories,
  CategoryItem,
} from "@/hooks/use-admin-addon-categories";

// Products
import {
  useAllProducts,
  useLinkedProducts,
  useSetLinkedProducts,
} from "@/hooks/use-admin-addon-products";

interface Props {
  category?: AdminAddonCategory | null;
  isOpen: boolean;
  onClose: () => void;
}

type Option = { value: number; label: string };

export default function EditAddonCategoryModal({
  category,
  isOpen,
  onClose,
}: Props) {
  const {
    createAddonCategory,
    updateAddonCategory,
    setLinkedProductCategories,
  } = useAdminAddonCategories();

  const { mutateAsync: setLinkedProducts } = useSetLinkedProducts();

  // ---------- Categories ----------

  const { data: allCats = [], isLoading: catsLoading } =
    useAllProductCategories();

  const { data: linkedCats = [], isLoading: linkedLoading } =
    useLinkedProductCategories(category?.id);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const categoryOptions: Option[] = useMemo(
    () =>
      allCats.map((c) => ({
        value: c.id,
        label: c.name_ar ? `${c.name} / ${c.name_ar}` : c.name,
      })),
    [allCats],
  );

  // ---------- Products ----------

  const { data: allProducts = [], isLoading: productsLoading } =
    useAllProducts();

  const { data: linkedProducts = [], isLoading: linkedProductsLoading } =
    useLinkedProducts(category?.id);

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const productOptions: Option[] = useMemo(
    () =>
      allProducts.map((p) => ({
        value: p.id,
        label: p.name_ar ? `${p.name} / ${p.name_ar}` : p.name,
      })),
    [allProducts],
  );

  // ---------- Prefill Logic ----------

  useEffect(() => {
    if (!isOpen || !category?.id) return;
    if (catsLoading || linkedLoading) return;

    setSelectedCategoryIds(linkedCats.map((c: CategoryItem) => String(c.id)));
  }, [isOpen, category?.id, catsLoading, linkedLoading, linkedCats]);

  useEffect(() => {
    if (!isOpen || !category?.id) return;
    if (productsLoading || linkedProductsLoading) return;

    setSelectedProductIds(linkedProducts.map((p: any) => String(p.id)));
  }, [
    isOpen,
    category?.id,
    productsLoading,
    linkedProductsLoading,
    linkedProducts,
  ]);

  // ---------- Form ----------

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      name_ar: category?.name_ar || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values) => {
      let id = category?.id;

      if (id) {
        await updateAddonCategory.mutateAsync({ id, data: values });
      } else {
        const created = await createAddonCategory.mutateAsync(values);
        id = (created as any)?.id ?? null;
      }

      if (id) {
        await setLinkedProductCategories.mutateAsync({
          addonCategoryId: id,
          categoryIds: selectedCategoryIds.map(Number),
        });

        await setLinkedProducts({
          addonCategoryId: id,
          productIds: selectedProductIds.map(Number),
        });
      }

      onClose();
    },
  });

  const isEdit = !!category?.id;

  const isSaving =
    createAddonCategory.isPending ||
    updateAddonCategory.isPending ||
    setLinkedProductCategories.isPending;

  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent ref={contentRef}>
        <ModalHeader>
          {category ? "Edit Addon Category" : "Add Addon Category"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Name (Arabic)</FormLabel>
              <Input
                name="name_ar"
                value={formik.values.name_ar}
                onChange={formik.handleChange}
              />
            </FormControl>

            {/* Categories */}
            <FormControl mb={3}>
              <FormLabel>Linked Product Categories</FormLabel>
              {catsLoading || linkedLoading ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  isMulti
                  options={categoryOptions}
                  value={categoryOptions.filter((opt) =>
                    selectedCategoryIds.includes(String(opt.value)),
                  )}
                  onChange={(vals: MultiValue<Option>) =>
                    setSelectedCategoryIds(vals.map((v) => String(v.value)))
                  }
                  menuPortalTarget={contentRef.current ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            </FormControl>

            {/* Products */}
            <FormControl mb={1}>
              <FormLabel>Linked Products</FormLabel>
              {productsLoading || linkedProductsLoading ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  isMulti
                  options={productOptions}
                  value={productOptions.filter((opt) =>
                    selectedProductIds.includes(String(opt.value)),
                  )}
                  onChange={(vals: MultiValue<Option>) =>
                    setSelectedProductIds(vals.map((v) => String(v.value)))
                  }
                  menuPortalTarget={contentRef.current ?? undefined}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brandBlue"
            onClick={() => formik.handleSubmit()}
            isLoading={isSaving}
          >
            {category ? "Save Changes" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
