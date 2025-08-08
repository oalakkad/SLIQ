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

interface EditCategoryModalProps {
  category: AdminCategory;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({
  category,
  isOpen,
  onClose,
}: EditCategoryModalProps) {
  const toast = useToast();
  const { updateCategory } = useAdminCategories();

  // 🔹 Local form state
  const [name, setName] = useState(category.name);
  const [nameAr, setNameAr] = useState(category.name_ar ?? "");
  const [slug, setSlug] = useState(category.slug);
  const [parent, setParent] = useState<number | null>(category.parent);

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setNameAr(category.name_ar ?? "");
      setSlug(category.slug);
      setParent(category.parent);
    }
  }, [category]);

  // 🔹 Handle Save
  const handleSave = () => {
    updateCategory.mutate(
      {
        id: category.id,
        data: {
          name,
          name_ar: nameAr,
          slug,
          parent: parent,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Category updated successfully!", status: "success" });
          onClose();
        },
        onError: () => {
          toast({ title: "Failed to update category.", status: "error" });
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
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

            <FormControl>
              <FormLabel>Slug</FormLabel>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Parent ID</FormLabel>
              <NumberInput
                value={parent ?? ""}
                onChange={(value) => setParent(value ? parseInt(value) : null)}
                min={0}
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
            isLoading={updateCategory.isPending}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
