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
  Input,
  FormControl,
  FormLabel,
  useToast,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAddress } from "@/hooks/use-address";
import { useSelector } from "react-redux";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAddressModal({
  isOpen,
  onClose,
}: AddAddressModalProps) {
  const toast = useToast();
  const { addAddress } = useAddress();
  const isArabic = useSelector((state: any) => state.lang.isArabic);

  const [form, setForm] = useState({
    full_name: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    is_default: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await addAddress.mutateAsync(form);
      toast({
        title: isArabic ? "تمت إضافة العنوان." : "Address added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setForm({
        full_name: "",
        address_line: "",
        city: "",
        postal_code: "",
        country: "",
        phone: "",
        is_default: false,
      });
    } catch (err: any) {
      toast({
        title: isArabic ? "فشل في إضافة العنوان." : "Failed to add address.",
        description:
          err?.response?.data?.detail ||
          (isArabic ? "حدث خطأ ما." : "Something went wrong."),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent dir={isArabic ? "rtl" : "ltr"}>
        <ModalHeader textAlign={"center"}>
          {isArabic ? "إضافة عنوان جديد" : "Add New Address"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>{isArabic ? "الاسم الكامل" : "Full Name"}</FormLabel>
              <Input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{isArabic ? "العنوان" : "Address Line"}</FormLabel>
              <Input
                name="address_line"
                value={form.address_line}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{isArabic ? "المدينة" : "City"}</FormLabel>
              <Input name="city" value={form.city} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                {isArabic ? "الرمز البريدي" : "Postal Code"}
              </FormLabel>
              <Input
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{isArabic ? "الدولة" : "Country"}</FormLabel>
              <Input
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>{isArabic ? "رقم الهاتف" : "Phone"}</FormLabel>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <Checkbox
                name="is_default"
                isChecked={form.is_default}
                onChange={handleChange}
              >
                {isArabic ? "تعيين كعنوان افتراضي" : "Set as default address"}
              </Checkbox>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button colorScheme="pink" onClick={handleSubmit} ml={3}>
            {isArabic ? "حفظ" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
