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
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdminDiscount } from "@/hooks/use-admin-discounts";

interface EditDiscountModalProps {
  discount?: AdminDiscount | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<AdminDiscount>) => void;
}

export function EditDiscountModal({
  discount,
  isOpen,
  onClose,
  onSubmit,
}: EditDiscountModalProps) {
  const [formData, setFormData] = useState<Partial<AdminDiscount>>({});
  const toast = useToast();

  // Load data into form when editing
  useEffect(() => {
    if (discount) {
      setFormData(discount);
    } else {
      setFormData({
        code: "",
        description: "",
        discount_type: "percent",
        value: "0.000",
        applies_to_all: true,
        active: true,
      });
    }
  }, [discount]);

  const handleChange = (field: keyof AdminDiscount, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.code || !formData.value) {
      toast({
        title: "Code and value are required",
        status: "error",
        duration: 2000,
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {discount ? "Edit Discount" : "Add Discount"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Code</FormLabel>
              <Input
                value={formData.code || ""}
                onChange={(e) => handleChange("code", e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Discount Type</FormLabel>
              <Select
                value={formData.discount_type}
                onChange={(e) =>
                  handleChange("discount_type", e.target.value as any)
                }
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Value</FormLabel>
              <NumberInput
                step={0.001}
                precision={3}
                value={formData.value || "0.000"}
                onChange={(val) => handleChange("value", val)}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Usage Limit</FormLabel>
              <NumberInput
                value={formData.usage_limit ?? ""}
                onChange={(val) => handleChange("usage_limit", val ? Number(val) : null)}
              >
                <NumberInputField placeholder="Leave blank for unlimited" />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Per User Limit</FormLabel>
              <NumberInput
                value={formData.per_user_limit ?? ""}
                onChange={(val) =>
                  handleChange("per_user_limit", val ? Number(val) : null)
                }
              >
                <NumberInputField placeholder="Leave blank for unlimited" />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="datetime-local"
                value={formData.expiry_date ?? ""}
                onChange={(e) => handleChange("expiry_date", e.target.value)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Applies to All Products</FormLabel>
              <Switch
                isChecked={formData.applies_to_all ?? true}
                onChange={(e) => handleChange("applies_to_all", e.target.checked)}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Active</FormLabel>
              <Switch
                isChecked={formData.active ?? true}
                onChange={(e) => handleChange("active", e.target.checked)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button colorScheme="brandBlue" onClick={handleSubmit}>
            {discount ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}