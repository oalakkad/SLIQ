"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  AdminCategory,
  useAdminCategories,
} from "@/hooks/use-admin-categories";

type Mode = "create" | "edit";

interface EditCategoryModalProps {
  category?: AdminCategory; // undefined in create mode
  mode?: Mode; // default derived from presence of category
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({
  category,
  mode: incomingMode,
  isOpen,
  onClose,
}: EditCategoryModalProps) {
  const mode: Mode = incomingMode ?? (category ? "edit" : "create");
  const toast = useToast();
  const { createCategory, updateCategory } = useAdminCategories();

  // Local form state
  const [name, setName] = useState<string>(category?.name ?? "");
  const [nameAr, setNameAr] = useState<string>(category?.name_ar ?? "");
  const [slug, setSlug] = useState<string>(category?.slug ?? "");
  const [parent, setParent] = useState<number | null>(category?.parent ?? null);

  // Reset on open/category change
  useEffect(() => {
    if (!isOpen) return;
    setName(category?.name ?? "");
    setNameAr(category?.name_ar ?? "");
    setSlug(category?.slug ?? "");
    setParent(category?.parent ?? null);
  }, [category, isOpen]);

  const handleSave = async () => {
    try {
      if (mode === "edit" && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data: { name, name_ar: nameAr, slug, parent },
        });
        toast({ title: "Category updated successfully!", status: "success" });
        onClose();
        return;
      }

      // CREATE
      await createCategory.mutateAsync({
        name,
        name_ar: nameAr,
        slug,
        parent,
      });
      toast({ title: "Category created successfully!", status: "success" });
      onClose();
    } catch {
      toast({
        title:
          mode === "edit"
            ? "Failed to update category."
            : "Failed to create category.",
        status: "error",
      });
    }
  };

  const isSubmitting =
    mode === "edit" ? updateCategory.isPending : createCategory.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === "edit" ? "Edit Category" : "Add Category"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Category Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Category Name (Arabic)</FormLabel>
              <Input
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Slug</FormLabel>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Parent ID</FormLabel>
              <NumberInput
                min={0}
                value={parent ?? ""}
                onChange={(_str, num) =>
                  setParent(Number.isNaN(num) ? null : num)
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isSubmitting}
          >
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
