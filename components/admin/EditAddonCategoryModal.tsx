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

  // All available product categories
  const { data: allCats = [], isLoading: catsLoading } =
    useAllProductCategories();

  // Linked product categories for this addon category (only if editing)
  const { data: linkedCats = [], isLoading: linkedLoading } =
    useLinkedProductCategories(category?.id);

  // Local multiselect state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Build options for react-select
  const categoryOptions: Option[] = useMemo(
    () =>
      allCats.map((c) => ({
        value: c.id,
        label: c.name_ar ? `${c.name} / ${c.name_ar}` : c.name,
      })),
    [allCats]
  );

  // ----- Stable keys to prevent infinite loops -----
  const linkedDefaultIds: string[] = useMemo(
    () =>
      category?.id
        ? (linkedCats ?? []).map((c: CategoryItem) => String(c.id))
        : [],
    [category?.id, linkedCats]
  );
  const linkedDefaultsKey = useMemo(
    () => linkedDefaultIds.slice().sort().join(","),
    [linkedDefaultIds]
  );
  const selectedKey = useMemo(
    () => selectedIds.slice().sort().join(","),
    [selectedIds]
  );

  // Prefill only when:
  // - modal is open
  // - editing (has id)
  // - linkedCats finished loading
  // - current selection differs from linked defaults
  useEffect(() => {
    if (!isOpen) return;
    if (!category?.id) return; // add mode -> don't prefill
    if (catsLoading || linkedLoading) return;
    if (selectedKey === linkedDefaultsKey) return; // already in sync
    setSelectedIds(linkedDefaultIds);
  }, [
    isOpen,
    category?.id,
    catsLoading,
    linkedLoading,
    linkedDefaultsKey, // changes only when linked data actually changes
    // intentionally NOT including selectedKey to avoid re-running after user edits
  ]);

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

      // Create or update
      if (id) {
        await updateAddonCategory.mutateAsync({ id, data: values });
      } else {
        const created = await createAddonCategory.mutateAsync(values);
        // adjust if your API nests id differently
        id = (created as any)?.id ?? (created as any)?.data?.id ?? null;
      }

      // Assign product categories
      if (id) {
        const ids = selectedIds.map(Number);
        await setLinkedProductCategories.mutateAsync({
          addonCategoryId: id,
          categoryIds: ids,
        });
      }

      onClose();
    },
  });

  const isEdit = !!category?.id;

  // all booleans now ✅
  const inputsDisabled = catsLoading || (isEdit && linkedLoading);
  const selectDisabled = catsLoading || (isEdit && linkedLoading);
  const isSaving =
    createAddonCategory.isPending ||
    updateAddonCategory.isPending ||
    setLinkedProductCategories.isPending;

  // Value for react-select from selectedIds
  const selectedOptions: Option[] = useMemo(
    () =>
      categoryOptions.filter((opt) => selectedIds.includes(String(opt.value))),
    [categoryOptions, selectedIds]
  );

  // Portal react-select menu INSIDE the modal to avoid focus/overlay issues
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
            <FormControl mb={3} isDisabled={inputsDisabled}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl mb={3} isDisabled={inputsDisabled}>
              <FormLabel>Name (Arabic)</FormLabel>
              <Input
                name="name_ar"
                value={formik.values.name_ar}
                onChange={formik.handleChange}
              />
            </FormControl>

            {/* Do NOT disable this FormControl to avoid pointer-events:none on react-select */}
            <FormControl mb={1}>
              <FormLabel>Linked Product Categories</FormLabel>
              {selectDisabled ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  isMulti
                  options={categoryOptions}
                  value={selectedOptions}
                  onChange={(vals: MultiValue<Option>) =>
                    setSelectedIds(vals.map((v) => String(v.value)))
                  }
                  placeholder="Select categories..."
                  // keep it interactive
                  isDisabled={false}
                  // Portal menu inside modal content (avoid focus trap issues)
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
            isLoading={
              createAddonCategory.isPending ||
              updateAddonCategory.isPending ||
              setLinkedProductCategories.isPending
            }
            isDisabled={inputsDisabled || isSaving}
          >
            {category ? "Save Changes" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
