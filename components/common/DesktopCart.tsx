"use client";

import { useCart } from "@/hooks/use-cart";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import Link from "next/link";

export default function DesktopCart() {
  const {
    data: cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeCartItem,
  } = useCart();

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item?.product?.price) * item?.quantity,
    0
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      w="full"
      px={10}
      py={10}
      justify="space-between"
      align="start"
      gap={10}
    >
      <Box flex="3">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign={items.length > 0 ? "left" : "center"}
        >
          SHOPPING BAG
        </Text>
        {!(items.length > 0) && (
          <Text textAlign={"center"} my={2}>
            Your bag is empty.
          </Text>
        )}
        <Link href={"/shop"}>
          <Text
            fontSize="sm"
            mb={6}
            color="gray.500"
            textAlign={items.length > 0 ? "left" : "center"}
          >
            <u>Continue shopping</u>
          </Text>
        </Link>

        <VStack spacing={8} align="stretch">
          {items.map((item) => (
            <Flex key={item.id} align="center" justify="space-between">
              <HStack spacing={6} flex={"2"}>
                <Link href={`/products/${item.product.slug}`}>
                  <Image
                    boxSize="100px"
                    src={item.product.image}
                    alt={item.product.name}
                  />
                </Link>
                <Box>
                  <Link href={`/products/${item.product.slug}`}>
                    <Text fontWeight="medium">{item.product.name}</Text>
                  </Link>
                  <Button
                    size="xs"
                    variant="link"
                    mt={2}
                    onClick={() => removeCartItem.mutate(item.id)}
                  >
                    Remove
                  </Button>
                </Box>
              </HStack>

              <HStack spacing={4} flex={"1"}>
                <Button
                  size="sm"
                  onClick={() =>
                    updateCartItem.mutate({
                      id: item.id,
                      quantity: item.quantity - 1,
                    })
                  }
                >
                  -
                </Button>
                <Text>{item.quantity}</Text>
                <Button
                  size="sm"
                  onClick={() =>
                    updateCartItem.mutate({
                      id: item.id,
                      quantity: item.quantity + 1,
                    })
                  }
                >
                  +
                </Button>
              </HStack>

              <Box textAlign="right">
                <Text>
                  {(parseFloat(item.product.price) * item.quantity).toFixed(3)}{" "}
                  KWD
                </Text>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {items.length > 0 && (
        <Box flex="2" p={6} border="1px solid #eee" borderRadius="md">
          <Text fontWeight="medium" mb={2}>
            ORDER NOTE
          </Text>
          <Textarea placeholder="Add a note..." mb={4} minH={"150px"} />

          <Flex justify="space-between" fontWeight="medium" mb={2}>
            <Text>Subtotal</Text>
            <Text>{subtotal.toFixed(3)} KWD</Text>
          </Flex>

          <Button mt={4} w="full" variant={"solidYellow"} px={10} py={6}>
            CHECK OUT
          </Button>

          <Text fontSize="sm" mt={3} textAlign="center">
            Sign up to earn rewards for every purchase ✨
          </Text>
        </Box>
      )}
    </Flex>
  );
}
