"use client";

import { Box, Flex, Heading, useMediaQuery } from "@chakra-ui/react";
import FeaturedCard from "./FeaturedCard";
import { useWishlist } from "@/hooks/use-wishlist";

const products = [
  {
    id: 1001,
    name: "ANGELSTICK®",
    name_ar: "ANGELSTICK®",
    slug: "angelstick",
    description: "",
    description_ar: "",
    price: "28.50",
    stock_quantity: 1,
    image:
      "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
    is_new_arrival: false,
    is_best_seller: false,
    categories: [],
    images: [
      {
        id: 1001,
        product: 1001,
        image:
          "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
        alt_text: "ANGELSTICK®",
      },
    ],
    created_at: "2025-07-17T00:00:00Z",
    updated_at: "2025-07-17T00:00:00Z",
    badge: "AWARD WINNER",
  },
  {
    id: 1002,
    name: "HALO HAIR OIL",
    name_ar: "HALO HAIR OIL",
    slug: "halo-hair-oil",
    description: "",
    description_ar: "",
    price: "28.50",
    stock_quantity: 1,
    image:
      "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
    is_new_arrival: false,
    is_best_seller: false,
    categories: [],
    images: [
      {
        id: 1002,
        product: 1002,
        image:
          "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
        alt_text: "HALO HAIR OIL",
      },
    ],
    created_at: "2025-07-17T00:00:00Z",
    updated_at: "2025-07-17T00:00:00Z",
    badge: "AWARD WINNER",
  },
  {
    id: 1003,
    name: "Mini Boar Bristle Brush in Chantilly",
    name_ar: "Mini Boar Bristle Brush in Chantilly",
    slug: "mini-boar-bristle-brush-in-chantilly",
    description: "",
    description_ar: "",
    price: "36.00",
    stock_quantity: 1,
    image:
      "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
    is_new_arrival: false,
    is_best_seller: false,
    categories: [],
    images: [
      {
        id: 1003,
        product: 1003,
        image:
          "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
        alt_text: "Mini Boar Bristle Brush in Chantilly",
      },
    ],
    created_at: "2025-07-17T00:00:00Z",
    updated_at: "2025-07-17T00:00:00Z",
    badge: "BEST SELLER",
  },
  {
    id: 1004,
    name: "Big Effing Clip in Buttercream",
    name_ar: "Big Effing Clip in Buttercream",
    slug: "big-effing-clip-in-buttercream",
    description: "",
    description_ar: "",
    price: "27.00",
    stock_quantity: 1,
    image:
      "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
    is_new_arrival: false,
    is_best_seller: false,
    categories: [],
    images: [
      {
        id: 1004,
        product: 1004,
        image:
          "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
        alt_text: "Big Effing Clip in Buttercream",
      },
    ],
    created_at: "2025-07-17T00:00:00Z",
    updated_at: "2025-07-17T00:00:00Z",
    badge: "AWARD WINNER",
  },
];

export default function FeaturedProductCarousel({ title }: { title?: string }) {
  const [isMobile] = useMediaQuery("(max-width: 950px)");
  const { items: wishlist } = useWishlist();

  const wishlistMap = new Map(
    wishlist.map((item) => [item.product.id, item.id])
  );

  return (
    <Box
      overflowX={isMobile ? "auto" : "visible"}
      width="100%"
      scrollBehavior="smooth"
      px={isMobile ? 2 : 20}
      py={10}
      bg={"brand.lightgrey"}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {title && (
        <Heading
          fontFamily={"'Work Sans', sans-serif"}
          mb={6}
          mt={1}
          textAlign={"center"}
          color={"gray.500"}
        >
          {title.toUpperCase()}
        </Heading>
      )}
      <Flex w={isMobile ? "max-content" : "100%"} gap={4} px={1}>
        {products.map((product, index) => (
          <Box
            key={index}
            flexShrink={0}
            width={isMobile ? "calc(35% - 10px)" : "24%"} // 👈 2 per view on mobile
          >
            <FeaturedCard
              product={product}
              isWishlist={wishlistMap.has(product.id)}
              wishlistItemId={wishlistMap.get(product.id) ?? -1}
              height={200}
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
