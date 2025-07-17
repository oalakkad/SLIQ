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
  Text,
  Flex,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  onSave: (data: { first_name: string; last_name: string }) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const toast = useToast();

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Both fields are required.",
        status: "warning",
        isClosable: true,
      });
      return;
    }

    onSave({ first_name: firstName, last_name: lastName });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent p={2}>
        <ModalHeader fontSize="lg">EDIT PROFILE</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={4}>
          <SimpleGrid columns={2} spacing={4} mb={4}>
            <FormControl>
              <FormLabel fontSize="sm">First name</FormLabel>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Last name</FormLabel>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel fontSize="sm">Email</FormLabel>
            <Input value={user.email} isDisabled />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Email used for login can’t be changed
            </Text>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Flex gap={4}>
            <Button onClick={onClose} variant="ghost" fontWeight="normal">
              Cancel
            </Button>
            <Button onClick={handleSubmit} colorScheme="gray" fontWeight="bold">
              SAVE
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
