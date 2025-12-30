"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useChangePasswordMutation } from "@/redux/features/authApiSlice";
import { useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const isArabic = useSelector((state: any) => state.lang.isArabic);
  const toast = useToast();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    re_new_password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    if (form.new_password !== form.re_new_password) {
      setError(
        isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }

    try {
      await changePassword(form).unwrap();
      toast({
        title: isArabic
          ? "تم تغيير كلمة المرور بنجاح"
          : "Password updated successfully",
        status: "success",
      });
      onClose();
    } catch (err: any) {
      setError(
        err?.data?.current_password?.[0] ||
          (isArabic
            ? "كلمة المرور الحالية غير صحيحة"
            : "Invalid current password")
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent dir={isArabic ? "rtl" : "ltr"}>
        <ModalHeader>
          {isArabic ? "تغيير كلمة المرور" : "Change Password"}
        </ModalHeader>

        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!error}>
              <FormLabel>
                {isArabic ? "كلمة المرور الحالية" : "Current Password"}
              </FormLabel>
              <Input
                type="password"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                {isArabic ? "كلمة المرور الجديدة" : "New Password"}
              </FormLabel>
              <Input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isInvalid={!!error}>
              <FormLabel>
                {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
              </FormLabel>
              <Input
                type="password"
                name="re_new_password"
                value={form.re_new_password}
                onChange={handleChange}
              />
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            colorScheme="brandBlue"
            ml={3}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isArabic ? "حفظ" : "Save"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
