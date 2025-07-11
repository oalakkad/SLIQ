"use client";

import { Box, Flex, Heading, useMediaQuery } from "@chakra-ui/react";
import FeaturedCard from "./FeaturedCard";

const products = [
  {
    title: "ANGELSTICK®",
    price: 28.5,
    oldPrice: 38,
    image:
      "https://www.emijay.com/cdn/shop/files/angelstick.jpg?v=1696961351&width=1080",
    hoverImage:
      "https://www.emijay.com/cdn/shop/files/angelsticktopoff.jpg?v=1697502421&width=1080",
    badge: "AWARD WINNER",
  },
  {
    title: "HALO HAIR OIL",
    price: 28.5,
    oldPrice: 38,
    image:
      "https://www.emijay.com/cdn/shop/files/halohairoil_3e3e093d-fb26-4c97-bc16-601e3da2416d.jpg?v=1728938048&width=1080",
    hoverImage:
      "https://www.emijay.com/cdn/shop/files/halo_hair_oil_closeup.jpg?v=1728001288&width=1080",
    badge: "AWARD WINNER",
  },
  {
    title: "Mini Boar Bristle Brush in Chantilly",
    price: 36,
    oldPrice: 48,
    image:
      "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly.jpg?v=1722622988&width=1080",
    hoverImage:
      "https://www.emijay.com/cdn/shop/files/miniboarbristlebrushinchantilly3.jpg?v=1722623061&width=1080",
    badge: "BEST SELLER",
  },
  {
    title: "Big Effing Clip in Buttercream",
    price: 27,
    oldPrice: 336,
    image:
      "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream.jpg?v=1635898948&width=1080",
    hoverImage:
      "https://www.emijay.com/cdn/shop/products/bigeffingclipinbuttercream2.jpg?v=1650486885&width=1080",
    badge: "AWARD WINNER",
  },
];

export default function FeaturedProductCarousel({ title }: { title?: string }) {
  const [isMobile] = useMediaQuery("(max-width: 950px)");

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
            <FeaturedCard {...product} height={200} />
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
