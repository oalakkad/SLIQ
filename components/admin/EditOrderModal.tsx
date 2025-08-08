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
  Select,
  VStack,
  Input,
  Text,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAdminOrders, AdminOrder } from "@/hooks/use-admin-orders";

interface EditOrderModalProps {
  order: AdminOrder;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditOrderModal({
  order,
  isOpen,
  onClose,
}: EditOrderModalProps) {
  const { updateOrder } = useAdminOrders();

  // Editable fields
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(order.items);
  const [totalPrice, setTotalPrice] = useState(order.total_price);

  // 🔹 Recalculate total whenever items or quantities change
  useEffect(() => {
    const newTotal = items
      .reduce(
        (sum, item) =>
          sum + Number(item.price_at_purchase) * Number(item.quantity),
        0
      )
      .toFixed(3);
    setTotalPrice(newTotal);
  }, [items]);

  // 🔹 Handle quantity changes
  const handleItemQuantityChange = (index: number, quantity: number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], quantity };
    setItems(updatedItems);
  };

  // 🔹 Save order
  const handleSave = () => {
    const updatedOrder = {
      status,
      total_price: totalPrice,
      items_write: items.map((item) => ({
        id: item.id,
        product: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      })),
    };

    updateOrder.mutate(
      { id: order.id, data: updatedOrder },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent position={"absolute"} maxW="800px">
        <ModalHeader>Edit Order #{order.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Status */}
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on_delivery">On Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            {/* Total Price (auto-calculated, read-only) */}
            <Input
              type="number"
              step="0.001"
              value={totalPrice}
              isReadOnly
              placeholder="Total Price"
            />

            {/* Items */}
            <Text fontWeight="bold" mt={2}>
              Items
            </Text>
            {items.map((item, index) => (
              <HStack key={item.id} spacing={4} align="center">
                <Text flex="1">
                  {item.product.name} ({item.price_at_purchase} KWD)
                </Text>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemQuantityChange(index, Number(e.target.value))
                  }
                  width="80px"
                />
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
