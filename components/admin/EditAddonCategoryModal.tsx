"use client";

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
import { useEffect, useMemo, useState } from "react";
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

  // Local multiselect state (store as string IDs to match your submit mapping)
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

  // Pre-fill selections when linked categories load
  useEffect(() => {
    if (isOpen) {
      const defaults = (linkedCats ?? []).map((c: CategoryItem) =>
        String(c.id)
      );
      setSelectedIds(defaults);
    }
  }, [isOpen, linkedCats]);

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
        id = created.id;
      }

      // Assign product categories
      if (id) {
        const ids = selectedIds.map((s) => Number(s));
        await setLinkedProductCategories.mutateAsync({
          addonCategoryId: id,
          categoryIds: ids,
        });
      }

      onClose();
    },
  });

  const bodyDisabled: boolean = !!(catsLoading || (category && linkedLoading));

  // Compute the value for react-select from selectedIds
  const selectedOptions: Option[] = useMemo(
    () =>
      categoryOptions.filter((opt) => selectedIds.includes(String(opt.value))),
    [categoryOptions, selectedIds]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {category ? "Edit Addon Category" : "Add Addon Category"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <FormControl mb={3} isDisabled={bodyDisabled}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl mb={3} isDisabled={bodyDisabled}>
              <FormLabel>Name (Arabic)</FormLabel>
              <Input
                name="name_ar"
                value={formik.values.name_ar}
                onChange={formik.handleChange}
              />
            </FormControl>

            <FormControl mb={1} isDisabled={bodyDisabled}>
              <FormLabel>Linked Product Categories</FormLabel>
              {bodyDisabled ? (
                <Spinner size="sm" />
              ) : (
                <Select
                  isMulti
                  options={categoryOptions}
                  value={selectedOptions}
                  onChange={(vals: MultiValue<Option>) =>
                    setSelectedIds(vals.map((v) => String(v.value)))
                  }
                  isDisabled={bodyDisabled}
                  placeholder="Select categories..."
                  // Ensure the menu shows above Chakra Modal content
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
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
            colorScheme="blue"
            onClick={() => formik.handleSubmit()}
            isLoading={
              createAddonCategory.isPending ||
              updateAddonCategory.isPending ||
              setLinkedProductCategories.isPending
            }
            isDisabled={bodyDisabled}
          >
            {category ? "Save Changes" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
