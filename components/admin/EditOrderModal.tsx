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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Divider,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAdminOrders, AdminOrder } from "@/hooks/use-admin-orders";
import { useQueryClient } from "@tanstack/react-query";

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

  // Base data
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(order.items);
  const [totalPrice, setTotalPrice] = useState(order.total_price);
  const [discount, setDiscount] = useState(order.discount);
  const [discountAmount, setDiscountAmount] = useState(order.discount_amount);

  const queryClient = useQueryClient();

  // 🟢 Shipping address state
  const [shipping, setShipping] = useState({
    full_name:
      order.shipping_full_name ||
      order.address?.full_name ||
      order.guest_name ||
      "",
    address_line: order.shipping_line || order.address?.address_line || "",
    city: order.shipping_city || order.address?.city || "",
    postal_code: order.shipping_postal_code || order.address?.postal_code || "",
    country: order.shipping_country || order.address?.country || "",
    phone:
      order.shipping_phone || order.address?.phone || order.guest_phone || "",
  });

  // 🔹 Recalculate total including discount
  useEffect(() => {
    const subtotal = items.reduce(
      (sum, item) =>
        sum + Number(item.price_at_purchase) * Number(item.quantity),
      0
    );
    const newTotal = (subtotal - Number(discountAmount || 0)).toFixed(3);
    setTotalPrice(newTotal);
  }, [items, discountAmount]);

  // 🔹 Handle quantity update
  const handleQuantityChange = (
    index: number,
    valueAsString: string,
    valueAsNumber: number
  ) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], quantity: valueAsNumber };
      return next;
    });
  };

  // 🔹 Handle addon custom name change
  const handleCustomNameChange = (
    itemIndex: number,
    addonIndex: number,
    value: string
  ) => {
    setItems((prev) => {
      const next = [...prev];
      const item = next[itemIndex];
      if (!item.addons) return next;
      const addons = [...item.addons];
      addons[addonIndex] = {
        ...addons[addonIndex],
        addon: {
          ...addons[addonIndex].addon,
          custom_name: value,
        },
      };
      next[itemIndex] = { ...item, addons };
      return next;
    });
  };

  // 🔹 Handle shipping address change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Save all updates
  const handleSave = () => {
    const updatedOrder = {
      status,
      total_price: totalPrice,
      discount: discount ? discount.id : null,
      discount_amount: discountAmount,
      items_write: items.map((item) => ({
        id: item.id,
        product: item.product.id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
        addons: item.addons?.map((a: any) => ({
          category_id: a.category?.id ?? null,
          addon_id: a.addon?.id ?? null,
          option_ids: (a.options || []).map((opt: any) => opt.id),
          custom_name: a.addon?.custom_name ?? null,
        })),
      })),
      shipping_full_name: shipping.full_name,
      shipping_line: shipping.address_line,
      shipping_city: shipping.city,
      shipping_postal_code: shipping.postal_code,
      shipping_country: shipping.country,
      shipping_phone: shipping.phone,
    };

    updateOrder.mutate(
      { id: order.id, data: updatedOrder },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["adminOrders"] }); // ✅ refetch latest
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="5xl">
      <ModalOverlay />
      <ModalContent maxW="900px">
        <ModalHeader>Edit Order #{order.id}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Status */}
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="on_delivery">On Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>

            {/* Shipping Address */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Shipping Address
              </Text>
              <VStack spacing={2} align="stretch">
                <Input
                  name="full_name"
                  placeholder="Full Name"
                  value={shipping.full_name}
                  onChange={handleShippingChange}
                />
                <Input
                  name="address_line"
                  placeholder="Address Line"
                  value={shipping.address_line}
                  onChange={handleShippingChange}
                />
                <HStack>
                  <Input
                    name="city"
                    placeholder="City"
                    value={shipping.city}
                    onChange={handleShippingChange}
                  />
                  <Input
                    name="postal_code"
                    placeholder="Postal Code"
                    value={shipping.postal_code}
                    onChange={handleShippingChange}
                  />
                </HStack>
                <Input
                  name="country"
                  placeholder="Country"
                  value={shipping.country}
                  onChange={handleShippingChange}
                />
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                />
              </VStack>
            </Box>

            {/* Totals */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Totals
              </Text>
              <Input value={totalPrice} isReadOnly mb={2} />
              {discount && (
                <Box fontSize="sm" color="green.600">
                  <Text>
                    Discount ({discount.code}): -
                    {Number(discountAmount).toFixed(3)} KWD
                  </Text>
                </Box>
              )}
            </Box>

            {/* Items */}
            <Text fontWeight="bold">Items</Text>
            {items.map((item, i) => (
              <Box key={item.id} borderWidth="1px" borderRadius="md" p={4}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold">{item.product.name}</Text>
                  <NumberInput
                    value={item.quantity}
                    min={1}
                    max={99}
                    onChange={(valStr, valNum) =>
                      handleQuantityChange(i, valStr, valNum)
                    }
                    w="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {item.price_at_purchase} KWD each
                </Text>

                {/* Addons */}
                {item.addons && item.addons.length > 0 && (
                  <VStack align="stretch" mt={4} spacing={4}>
                    {item.addons.map((addon, j) => (
                      <Box key={j} p={3} borderWidth="1px" borderRadius="md">
                        <Text fontWeight="bold">{addon.addon.name}</Text>

                        {addon.addon.requires_custom_name && (
                          <Input
                            mt={2}
                            placeholder="Custom name"
                            value={addon.addon.custom_name ?? ""}
                            onChange={(e) =>
                              handleCustomNameChange(i, j, e.target.value)
                            }
                          />
                        )}

                        {addon.options && addon.options.length > 0 && (
                          <VStack align="stretch" mt={3} spacing={1}>
                            {addon.options.map((opt: any) => (
                              <Text key={opt.id} fontSize="sm">
                                • {opt.name} (+{opt.extra_price} KWD)
                              </Text>
                            ))}
                          </VStack>
                        )}
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>
            ))}
          </VStack>
        </ModalBody>

        <Divider />
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="brandBlue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
