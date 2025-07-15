"use client";

import FeaturedCard, {
  FeaturedCardProps,
} from "@/components/common/FeaturedCard";
import { useCart } from "@/hooks/use-cart";
import { usePaginatedProducts } from "@/hooks/use-products";
import { useWishlist } from "@/hooks/use-wishlist";
import { ChevronLeftIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useState, useRef } from "react";

// const products: FeaturedCardProps[] = [
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "ANGELSTICK®",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "HALO HAIR OIL",
//     price: 28.5,
//     oldPrice: 38,
//     image:
//       "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
//     badge: "AWARD WINNER",
//   },
//   {
//     title: "Mini Boar Bristle Brush in Chantilly",
//     price: 36,
//     oldPrice: 48,
//     image:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
//     badge: "BEST SELLER",
//   },
//   {
//     title: "Big Effing Clip in Buttercream",
//     price: 27,
//     oldPrice: 336,
//     image:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
//     hoverImage:
//       "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
//     badge: "AWARD WINNER",
//   },
// ];

export default function Page() {
  const [isMobile] = useMediaQuery(["(max-width: 950px)"]);

  const [page, setPage] = useState(1);

  const { items: wishlist } = useWishlist();

  const wishlistMap = new Map(
    wishlist.map((item) => [item.product.id, item.id])
  );

  const { data, isLoading, isError } = usePaginatedProducts(page);

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
      <Heading
        fontFamily={"'Readex Pro', sans-serif"}
        textAlign={"center"}
        px={isMobile ? 2 : "100px"}
        color={"gray.600"}
      >
        SHOP ALL
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
      <SimpleGrid
        columns={{ base: 2, md: 4 }}
        spacing={isMobile ? 2 : 6}
        pt={5}
        px={isMobile ? 2 : "100px"}
      >
        {data?.results.map((product, index) => (
          <Flex
            key={`${product.id}-${page}`}
            direction="column"
            justify="space-between"
            height="100%" // Ensures content doesn't overflow
            minHeight="100%" // Ensure height fills cell
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
        {/* {products.map((product, index) => (
          <Flex
            key={index}
            direction="column"
            justify="space-between"
            height="100%" // Ensures content doesn't overflow
            minHeight="100%" // Ensure height fills cell
          >
            <Box width="100%" height="100%">
              <FeaturedCard {...product} height={200} />
            </Box>
          </Flex>
        ))} */}
      </SimpleGrid>
      {/* Pagination Control */}
      <Flex w={"100%"} justifyContent={"center"} mt={10}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            onClick={() => setPage(i + 1)}
            border={"none"}
            color={page === i + 1 ? "white" : "black"}
            variant={page === i + 1 ? "solidPink" : "outlinePink"}
          >
            {i + 1}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
