"use client";

import {
  Box,
  Flex,
  Image,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  useMediaQuery,
  Spinner,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { useProduct } from "@/hooks/use-products";
import { useParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useMemo, useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: product, isLoading } = useProduct(params.slug);
  const { addToCart, data: cart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const isInCart = useMemo(() => {
    return cart?.items?.some((item) => item.product?.id === product?.id);
  }, [cart, product]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  return (
    <Flex
      direction={isMobile ? "column" : "row"}
      gap={10}
      px={isMobile ? 4 : 20}
      py={10}
      alignItems={isMobile ? "center" : "start"}
    >
      {/* Image Section */}
      <VStack flex={1} spacing={4} align="center">
        <Image
          src={product?.image}
          alt={product?.name}
          maxW={isMobile ? "100%" : "400px"}
          borderRadius="md"
        />
        <HStack spacing={2}>
          {product?.images?.map((img, index) => (
            <Image
              key={index}
              src={img.image}
              alt={`thumb-${index}`}
              boxSize="60px"
              borderRadius="md"
              objectFit="cover"
            />
          ))}
        </HStack>
      </VStack>

      {/* Details Section */}
      <Box flex={1}>
        <Text fontSize="sm" color="gray.600" fontWeight="bold">
          LIMITED EDITION
        </Text>
        <Text fontSize="2xl" fontWeight="bold" mt={2}>
          {product?.name}
        </Text>
        <HStack spacing={3} mt={1}>
          <Text fontSize="xl" fontWeight="semibold">
            {Number(product?.price).toFixed(3)} KWD
          </Text>
        </HStack>

        <Text mt={6} fontWeight="medium">
          QUANTITY
        </Text>
        <HStack mt={2}>
          <Button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </Button>
          <Text>{quantity}</Text>
          <Button onClick={() => setQuantity((q) => q + 1)}>+</Button>
        </HStack>

        <Button
          mt={6}
          w="full"
          bg={isInCart ? "gray.400" : "gray.700"}
          color="white"
          _hover={{ bg: isInCart ? "gray.400" : "gray.800" }}
          onClick={() =>
            !isInCart &&
            product &&
            addToCart.mutate({ product_id: product?.id, quantity })
          }
          disabled={isInCart}
          py={6}
          fontSize="sm"
        >
          {isInCart ? "IN CART" : "ADD TO BAG"}
        </Button>

        <Button leftIcon={<FiHeart />} variant="ghost" mt={2}>
          Add to Wishlist
        </Button>

        <Text mt={6} fontSize="sm" color="gray.700">
          Give the gift of heavenly hair. Elevate your on-the-go hairstyles with
          our most effortless and desired pieces.
        </Text>

        <VStack spacing={1} align="start" mt={4} fontSize="sm">
          <Text>Description</Text>
        </VStack>
      </Box>
    </Flex>
  );
}
