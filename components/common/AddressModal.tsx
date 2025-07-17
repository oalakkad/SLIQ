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
  useDisclosure,
  VStack,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAddress } from "@/hooks/use-address"; // make sure path is correct

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
        title: "Address added.",
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
        title: "Failed to add address.",
        description: err?.response?.data?.detail || "Something went wrong.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"md"} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Address Line</FormLabel>
                <Input
                  name="address_line"
                  value={form.address_line}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>City</FormLabel>
                <Input name="city" value={form.city} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  name="is_default"
                  isChecked={form.is_default}
                  onChange={handleChange}
                >
                  Set as default address
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="pink" onClick={handleSubmit} ml={3}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
