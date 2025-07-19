"use client";

import {
  Box,
  VStack,
  Image,
  Text,
  Button,
  HStack,
  Divider,
  Spinner,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export default function MobileCart() {
  const { data: cart, isLoading, updateCartItem, removeCartItem } = useCart();

  const items = cart?.items ?? [];

  const subtotal = items.reduce(
    (acc, item) => acc + parseFloat(item?.product?.price) * item?.quantity,
    0
  );

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="50vh">
        <Spinner color="brand.pink" size="xl" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={6}>
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={2}
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

      <VStack spacing={6} align="stretch">
        {items.map((item) => (
          <Box key={item.id}>
            <HStack align="start" spacing={4} w="full">
              <Link href={`/products/${item.product.slug}`}>
                <Image
                  boxSize="100px"
                  src={item.product.image}
                  alt={item.product.name}
                />
              </Link>
              <Box flex="1">
                <Link href={`/products/${item.product.slug}`}>
                  <Text fontWeight="medium">{item.product.name}</Text>
                </Link>
                <HStack spacing={3} mt={2}>
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
                <Button
                  size="xs"
                  variant="link"
                  mt={1}
                  onClick={() => removeCartItem.mutate(item.id)}
                >
                  Remove
                </Button>
              </Box>
              <Box textAlign="right" minW="60px">
                <Text fontWeight="medium">
                  {(parseFloat(item.product.price) * item.quantity).toFixed(3)}{" "}
                  KWD
                </Text>
              </Box>
            </HStack>
            <Divider mt={4} />
          </Box>
        ))}
      </VStack>

      {items.length > 0 && (
        <Box mt={6}>
          <Text fontWeight="medium" mb={2}>
            ORDER NOTE
          </Text>
          <Textarea placeholder="Add a note..." mb={4} minH="120px" />

          <HStack justify="space-between" mb={2}>
            <Text fontWeight="medium">Subtotal</Text>
            <Text fontWeight="medium">{subtotal.toFixed(3)} KWD</Text>
          </HStack>

          <Button mt={4} w="full" variant={"solidYellow"} px={10} py={6}>
            CHECK OUT
          </Button>

          <Text fontSize="sm" mt={3} textAlign="center">
            Sign up to earn rewards for every purchase ✨
          </Text>
        </Box>
      )}
    </Box>
  );
}
