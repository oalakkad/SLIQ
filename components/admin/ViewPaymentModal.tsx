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
  Box,
  Text,
  Code,
  VStack,
} from "@chakra-ui/react";
import { AdminPayment } from "@/hooks/use-admin-payments";

interface Props {
  payment: AdminPayment;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewPaymentModal({ payment, isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment #{payment.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold">Order ID:</Text>
              <Text>{payment.order?.id ?? "—"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Customer:</Text>
              <Text>
                {payment.order?.user
                  ? `${payment.order.user.first_name} ${payment.order.user.last_name} (${payment.order.user.email})`
                  : `${payment.order?.guest_name ?? "Guest"} (${payment.order?.guest_email ?? "—"})`}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Amount:</Text>
              <Text>
                {payment.amount} {payment.currency}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Status:</Text>
              <Text>{payment.status}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Invoice ID:</Text>
              <Text>{payment.invoice_id ?? "—"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Payment ID:</Text>
              <Text>{payment.payment_id ?? "—"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Method ID:</Text>
              <Text>{payment.method_id ?? "—"}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Paid At:</Text>
              <Text>{payment.paid_at ? new Date(payment.paid_at).toLocaleString() : "—"}</Text>
            </Box>
            <Box>
            <Text fontWeight="bold">Gateway Response:</Text>
            <Code
                whiteSpace="pre-wrap"
                display="block"
                p={2}
                w="full"
                overflowX="auto"
            >
                {JSON.stringify(payment.gateway_response, null, 2)}
            </Code>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="brandPink">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}