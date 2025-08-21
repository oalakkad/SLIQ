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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AdminCustomer, useAdminCustomers } from "@/hooks/use-admin-customers";

interface EditCustomerModalProps {
  customer: AdminCustomer;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCustomerModal({
  customer,
  isOpen,
  onClose,
}: EditCustomerModalProps) {
  const toast = useToast();
  const { updateCustomer } = useAdminCustomers();

  // 🔹 Local form state
  const [firstName, setFirstName] = useState(customer.first_name);
  const [lastName, setLastName] = useState(customer.last_name);
  const [email, setEmail] = useState(customer.email);

  // Reset form when modal opens with a new customer
  useEffect(() => {
    if (customer) {
      setFirstName(customer.first_name);
      setLastName(customer.last_name);
      setEmail(customer.email);
    }
  }, [customer]);

  // 🔹 Save Changes
  const handleSave = () => {
    updateCustomer.mutate(
      {
        id: customer.id,
        data: { first_name: firstName, last_name: lastName, email },
      },
      {
        onSuccess: () => {
          toast({ title: "Customer updated successfully!", status: "success" });
          onClose();
        },
        onError: () => {
          toast({ title: "Failed to update customer.", status: "error" });
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Customer</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="brandPink"
            onClick={handleSave}
            isLoading={updateCustomer.isPending}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
