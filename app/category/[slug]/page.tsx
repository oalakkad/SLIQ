"use client";

import FeaturedCard, {
  FeaturedCardProps,
} from "@/components/common/FeaturedCard";
import { useCart } from "@/hooks/use-cart";
import { usePaginatedProducts } from "@/hooks/use-products";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  Box,
  Flex,
  Heading,
  Portal,
  SimpleGrid,
  useMediaQuery,
  Select,
  Center,
  Circle,
  useDisclosure,
  Button,
  Text,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 950px)"]);

  const params = useParams();
  const slug = params?.slug as string;

  console.log(slug);

  const [page, setPage] = useState(1);

  const { data, isLoading } = usePaginatedProducts(page, {
    category_slug: slug,
  });

  console.log(data);

  const { items: wishlist } = useWishlist();

  const wishlistMap = new Map(
    wishlist.map((item) => [item.product.id, item.id])
  );

  const totalPages = Math.ceil((data?.count || 0) / 12);

  console.log("Data:", data);

  const [color, setColor] = useState<string>("all");
  const [sort, setSort] = useState<string>("none");

  const COLORS = [
    {
      name: "all",
      value:
        "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
    },
    { name: "black", value: "#000" },
    { name: "white", value: "#fff" },
    { name: "brown", value: "#8B4513" },
    { name: "beige", value: "#f5f5dc" },
    { name: "gold", value: "#ffd700" },
    { name: "gray", value: "#808080" },
    { name: "pink", value: "#ffc0cb" },
    { name: "silver", value: "#c0c0c0" },
    { name: "lavender", value: "#e6e6fa" },
    { name: "purple", value: "#800080" },
    { name: "yellow", value: "#ffff00" },
  ];

  const { isOpen, onToggle } = useDisclosure();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <Box bg={"#FAFAF9"} py={7}>
      {!isLoading ? (
        <>
          <Heading
            fontFamily={"'Readex Pro', sans-serif"}
            textAlign={"center"}
            px={isMobile ? 2 : "100px"}
            color={"gray.600"}
          >
            {data?.results[0].categories[0].name}
          </Heading>
          <Flex
            px={isMobile ? 2 : "100px"}
            justifyContent={"space-between"}
            pt={10}
          >
            <Button
              onClick={onToggle}
              w={isMobile ? "150px" : "250px"}
              h={"45px"}
              fontWeight={600}
              color={"gray.400"}
              fontFamily={"'Work Sans', sans-serif"}
              leftIcon={
                <Circle
                  size="20px"
                  border={"1px solid #ccc"}
                  bg={
                    color === "all"
                      ? undefined
                      : COLORS.find((c) => c.name === color)?.value
                  }
                  bgGradient={
                    color === "all"
                      ? "linear(to-r, red, orange, yellow, green, blue, indigo, violet)"
                      : undefined
                  }
                />
              }
            >
              {color === "all"
                ? "All Colors"
                : color[0].toUpperCase() + color.slice(1)}
            </Button>
            {!isMobile && isOpen && (
              <Center mt={6} flexDir="column">
                {hoveredColor && (
                  <Text
                    mb={2}
                    fontSize="lg"
                    fontWeight="semibold"
                    position={"absolute"}
                    color={"gray.400"}
                    fontFamily={"'Work Sans', sans-serif"}
                    mt={"-115px"}
                  >
                    {hoveredColor.toUpperCase()}
                  </Text>
                )}
                {
                  <Flex wrap="wrap" gap={1} justify="center" maxW={"285px"}>
                    {COLORS.map((color) => (
                      <Circle
                        key={color.name}
                        size="26px"
                        bg={color.value}
                        border="1px solid #ccc"
                        onClick={() => setColor(color.name)}
                        cursor="pointer"
                        onMouseEnter={() => setHoveredColor(color.name)}
                        onMouseLeave={() => setHoveredColor(null)}
                        _hover={{ transform: "scale(1.1)" }}
                      />
                    ))}
                  </Flex>
                }
              </Center>
            )}
            <Select
              placeholder="SORT BY"
              size="lg"
              w={isMobile ? "150px" : "250px"}
              borderRadius={0}
              border={"none"}
              color={"gray.400"}
              fontWeight={600}
              fontFamily={"'Work Sans', sans-serif"}
              variant={"filled"}
              h={"45px"}
              bg="white"
              value={sort}
              style={{ paddingTop: "0" }}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-lth">Price, Low to High</option>
              <option value="price-htl">Price, High to Low</option>
            </Select>
          </Flex>
          {isMobile && (
            <Flex wrap="wrap" gap={1} justify="center" w={"100%"} mt={4}>
              {isOpen &&
                COLORS.map((color) => (
                  <Circle
                    key={color.name}
                    size="26px"
                    bg={color.value}
                    border="1px solid #ccc"
                    onClick={() => setColor(color.name)}
                    cursor="pointer"
                    onMouseEnter={() => setHoveredColor(color.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    _hover={{ transform: "scale(1.1)" }}
                  />
                ))}
            </Flex>
          )}
          <AnimatePresence mode="wait">
            {data && (
              <motion.div
                key={page} // Animate only when page changes
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleGrid
                  columns={{ base: 2, md: 4 }}
                  spacing={isMobile ? 2 : 6}
                  pt={5}
                  px={isMobile ? 2 : "100px"}
                >
                  {data.results.map((product) => (
                    <Flex
                      key={`${product.id}-${page}`}
                      direction="column"
                      justify="space-between"
                      height="100%"
                      minHeight="100%"
                    >
                      <Box width="100%" height="100%">
                        <FeaturedCard
                          product={product}
                          height={200}
                          isWishlist={wishlistMap.has(product.id)}
                          wishlistItemId={wishlistMap.get(product.id) ?? -1}
                        />
                      </Box>
                    </Flex>
                  ))}
                </SimpleGrid>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Pagination Control */}
          <Flex w={"100%"} justifyContent={"center"} mt={10}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                onClick={() => setPage(i + 1)}
                mr={1}
                border={"none"}
                color={page === i + 1 ? "white" : "black"}
                variant={page === i + 1 ? "solidPink" : "outlinePink"}
              >
                {i + 1}
              </Button>
            ))}
          </Flex>
        </>
      ) : (
        <Flex justify="center" align="center" h="50vh">
          <Spinner size="xl" />
        </Flex>
      )}
    </Box>
  );
}
