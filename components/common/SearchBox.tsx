"use client";

import {
  Box,
  Flex,
  Input,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Slide,
  Spinner,
  Text,
  Image,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { CiSearch } from "react-icons/ci";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePaginatedProducts } from "@/hooks/use-products";

export default function SearchPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const { data, isLoading } = usePaginatedProducts(1, {
    search: debouncedSearch,
  });

  const results = (
    <Box
      top="100%"
      left={0}
      right={0}
      bg="white"
      zIndex={999}
      maxH="75%"
      overflowY="auto"
      mt={2}
      px={{ base: 4, md: 20 }}
    >
      {isLoading ? (
        <Flex justify="center" py={4}>
          <Spinner color="brand.pink" />
        </Flex>
      ) : data?.results?.length ? (
        <VStack spacing={3} align="stretch" py={2}>
          {data.results.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={onClose}
            >
              <Flex
                align="center"
                gap={4}
                px={2}
                py={2}
                _hover={{ bg: "gray.50" }}
                borderRadius="md"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  boxSize="40px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    {product.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {Number(product.price).toFixed(3)} KWD
                  </Text>
                </Box>
              </Flex>
            </Link>
          ))}
        </VStack>
      ) : (
        <Flex justify="center" py={4}>
          <Text fontSize="sm" color="gray.500">
            No results found.
          </Text>
        </Flex>
      )}
    </Box>
  );

  const Content = (
    <Box
      bg="white"
      w="full"
      px={{ base: 4, md: 20 }}
      py={{ base: 3, md: 8 }}
      // boxShadow="0 20px 50px rgba(0, 0, 0, 0.6)"
      position="relative"
      zIndex={999}
    >
      <Flex justify="space-between" align="center">
        <Flex flex={1} align="center" gap={4}>
          <CiSearch size={28} color="gray" cursor="pointer" />
          <Input
            ref={inputRef}
            variant="unstyled"
            placeholder="Search our store"
            border="none"
            fontSize="lg"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            color="gray.700"
            fontFamily="'Work Sans', sans-serif"
            _focus={{ border: "none", boxShadow: "none" }}
            _placeholder={{ color: "gray.400" }}
          />
        </Flex>
        <IconButton
          icon={<CloseIcon />}
          aria-label="Close search"
          variant="link"
          onClick={onClose}
          size="md"
        />
      </Flex>
      {searchValue && results}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerBody p={0} zIndex={1} mt={10}>
            {Content}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return isOpen ? (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="black"
        onClick={onClose}
        opacity={0.8}
        zIndex={998}
      />
      <Slide direction="top" in={isOpen} style={{ zIndex: 999 }}>
        {Content}
      </Slide>
    </>
  ) : null;
}
