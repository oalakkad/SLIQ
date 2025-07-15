"use client";

import {
  Box,
  Text,
  Image,
  Button,
  IconButton,
  Flex,
  Spinner,
  SimpleGrid,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist";

export default function MobileWishlist() {
  const { items, isLoading, removeFromWishlist, clearWishlist } = useWishlist();

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box px={4} py={6}>
      {/* Title and Clear Wishlist */}
      <Flex direction="column" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={1}>
          WISHLIST
        </Text>
        {items.length > 0 && (
          <Button
            onClick={() => clearWishlist.mutate()}
            size="sm"
            variant="link"
            fontFamily={"'Work Sans', serif"}
            color="gray.600"
            leftIcon={<FiX />}
          >
            Clear wishlist
          </Button>
        )}
      </Flex>

      {/* Items Grid */}
      <SimpleGrid columns={2} spacing={4}>
        {items.map((item) => (
          <Box
            key={item.id}
            position="relative"
            border="1px solid #eee"
            borderRadius="md"
            bg="white"
            overflow="hidden"
            p={3}
          >
            {/* Remove Button */}
            <IconButton
              icon={<FiX />}
              size="sm"
              aria-label="Remove"
              variant="ghost"
              position="absolute"
              top="8px"
              right="8px"
              onClick={() => removeFromWishlist.mutate(item.id)}
            />

            {/* Image */}
            <Image
              src={item.product.image}
              alt={item.product.name}
              w="100%"
              h="160px"
              objectFit="contain"
              mb={3}
            />

            {/* View Product */}
            <Link href={`/product/${item.product.slug}`} passHref>
              <Button
                as="a"
                w="100%"
                variant="outline"
                fontWeight="bold"
                fontSize="xs"
                borderRadius="none"
              >
                VIEW
              </Button>
            </Link>
          </Box>
        ))}
      </SimpleGrid>
      <Flex flexDir={"column"} w={"100%"} alignItems={"center"} mt={10}>
        <Text>Your wishlist is empty.</Text>
        <Link href={"/shop"}>
          <Button variant={"link"} my={3} fontFamily={"'Work Sans', serif"}>
            Discover More
          </Button>
        </Link>
      </Flex>
    </Box>
  );
}
