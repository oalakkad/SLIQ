"use client";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  VStack,
  useDisclosure,
  Spinner,
  Image,
  InputLeftAddon,
  InputGroup,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAddress } from "@/hooks/use-address";
import AddAddressModal from "@/components/common/AddressModal";
import { Cart, CartItem, useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";

const OrderSummary = ({ cart, isLoading }: { cart: Cart; isLoading: any }) => (
  <Box bg="brand.yellow" borderRadius="md" p={6} minW="300px">
    <Heading size="md" mb={4}>
      ORDER SUMMARY
    </Heading>
    <Stack spacing={4}>
      {!isLoading && cart && cart?.items?.length > 0 ? (
        cart.items.map((item: CartItem) => (
          <Flex key={item.id} align="center" justify="space-between">
            <Flex gap={3} align="center">
              <Box boxSize="50px" bg="gray.200" borderRadius="md">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
              <Box>
                <Text fontWeight="medium">{item.product.name}</Text>
                <Text fontSize="sm">x{item.quantity}</Text>
              </Box>
            </Flex>
            <Text>
              {(Number(item.product.price) * item.quantity).toFixed(2)} KWD
            </Text>
          </Flex>
        ))
      ) : (
        <Text>No items in cart.</Text>
      )}
      <Divider />
      <Flex justify="space-between">
        <Text fontWeight="bold">Total:</Text>
        <Text fontWeight="bold">
          {cart?.items
            ?.reduce(
              (sum, item) => sum + Number(item.product.price) * item.quantity,
              0
            )
            .toFixed(3)}{" "}
          KWD
        </Text>
      </Flex>
    </Stack>
  </Box>
);

export default function CheckoutPage() {
  const { data: cart, isLoading } = useCart();
  const { data: addresses, isLoading: isAddressLoading } = useAddress();
  const { createOrder } = useOrders();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (addresses?.results?.length && selectedAddressId === null) {
      const defaultAddr = addresses.results.find((addr) => addr.is_default);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses, selectedAddressId]);

  return (
    <Flex direction={{ base: "column", md: "row" }} px={4} py={6} gap={8}>
      {/* LEFT: Checkout form */}
      <Box flex={1}>
        <Heading size="md" mb={6}>
          DELIVERY
        </Heading>
        <Stack spacing={4}>
          <Input placeholder="Email address" type="email" />
          <Checkbox> Email me with news and offers </Checkbox>
        </Stack>

        <Box mt={8}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              SAVED ADDRESSES
            </Text>
            <Button size="sm" onClick={onOpen} variant={"link"}>
              Add Address
            </Button>
          </Flex>
          <AddAddressModal isOpen={isOpen} onClose={onClose} />
          {isAddressLoading ? (
            <Spinner color="brand.pink" />
          ) : addresses?.results?.length ? (
            <VStack spacing={4} align="stretch">
              {addresses.results.map((address) => (
                <Box
                  key={address.id}
                  onClick={() => setSelectedAddressId(address.id)}
                  cursor="pointer"
                  w="100%"
                  p={4}
                  bg={
                    address.id === selectedAddressId ? "brand.blue" : "gray.100"
                  }
                  borderRadius="md"
                >
                  <Text fontWeight="bold">{address.full_name}</Text>
                  <Text>{address.address_line}</Text>
                  <Text>
                    {address.city}, {address.postal_code}, {address.country}
                  </Text>
                  <Text>{address.phone}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No addresses found.</Text>
          )}
        </Box>

        <Divider my={8} />
        <Heading size="md" mb={6}>
          PAYMENT
        </Heading>
        <Stack spacing={4}>
          <Checkbox
            isChecked={useShippingAsBilling}
            onChange={(e) => setUseShippingAsBilling(e.target.checked)}
          >
            Use shipping address as billing address
          </Checkbox>
          <Input placeholder="Card number" />
          <Flex gap={4}>
            <Input placeholder="Expiration date (MM / YY)" />
            <Input placeholder="Security code" />
          </Flex>
          <Input placeholder="Name on card" />
        </Stack>
        {!useShippingAsBilling && (
          <Stack spacing={4} mt={4}>
            <Input placeholder="Country" />
            <Input placeholder="Address" />
            <Flex gap={4}>
              <Input placeholder="State" />
              <Input placeholder="City" />
              <Input placeholder="ZIP code" />
            </Flex>
          </Stack>
        )}

        <Divider my={8} />
        <Heading size="md" mb={4}>
          REMEMBER ME
        </Heading>
        <Checkbox defaultChecked>
          Save my information for faster checkout
        </Checkbox>
        <InputGroup>
          <InputLeftAddon bg={"brand.blue"}>+965</InputLeftAddon>
          <Input type="tel" placeholder="Mobile phone number" />
        </InputGroup>

        <Box display={{ base: "block", md: "none" }} mt={10}>
          <OrderSummary
            cart={cart ?? { id: -1, items: [] }}
            isLoading={isLoading}
          />
        </Box>

        <Button
          variant="solidBlue"
          mt={6}
          w="full"
          py={7}
          onClick={() => createOrder.mutate()}
        >
          PAY NOW
        </Button>
      </Box>

      {/* RIGHT: Order Summary */}
      <Box
        flex={1}
        display={{ base: "none", md: "block" }}
        position="sticky"
        top={4}
        alignSelf="flex-start"
      >
        <OrderSummary
          cart={cart ?? { id: -1, items: [] }}
          isLoading={isLoading}
        />
      </Box>
    </Flex>
  );
}
