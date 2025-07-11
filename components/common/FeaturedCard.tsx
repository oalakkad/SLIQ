"use client";

import {
  Box,
  Text,
  Image,
  Button,
  Stack,
  IconButton,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Motion wrapper
const MotionBox = motion(Box);

export interface FeaturedCardProps {
  badge?: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage: string;
}

export default function FeaturedCard({
  badge,
  title,
  price,
  oldPrice,
  image,
  hoverImage,
  height,
}: {
  badge?: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  hoverImage: string;
  height: number;
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [isTablet] = useMediaQuery("(max-width: 1200px)");

  const adjustedHeight = isMobile
    ? `${height}px`
    : isTablet
    ? `${Number(height) * 1.2}px`
    : `${Number(height) * 1.5}px`;

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      position="relative"
      bg="white"
      borderColor="gray.200"
      w="100%"
      overflow="hidden"
      textAlign="center"
      borderRadius={6}
      fontFamily={"'Readex Pro', sans-serif"}
    >
      <Flex
        position="absolute"
        alignItems={"center"}
        justifyContent="space-between"
        w={"100%"}
        top={0}
        p={2}
      >
        {/* Badge */}
        <Box h={"100%"}>
          {badge && !isImageHovered && (
            <Text
              fontSize={isMobile ? "0.5rem" : "xs"}
              fontWeight="bold"
              color="gray.600"
              zIndex={2}
              position={"absolute"}
              pointerEvents={"none"}
              ml={3}
            >
              {badge}
            </Text>
          )}
        </Box>

        {/* Heart icon */}
        <IconButton
          aria-label="wishlist"
          icon={<FiHeart />}
          size={"sm"}
          variant="ghost"
          zIndex={2}
          _hover={{ bg: "transparent", color: "gray.600" }}
        />
      </Flex>

      {/* Image area */}
      <Box
        position="relative"
        h={adjustedHeight}
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        <Image
          src={image}
          alt={title}
          height={adjustedHeight}
          w={"100%"}
          objectFit="cover"
          opacity={isImageHovered ? 0 : 1}
          transition="opacity 0.3s ease"
          position="absolute"
          top={0}
          left={0}
        />
        <Image
          src={hoverImage}
          alt={`${title} Hover`}
          height={adjustedHeight}
          w={"100%"}
          objectFit="cover"
          opacity={isImageHovered ? 1 : 0}
          transition="opacity 0.3s ease"
          position="absolute"
          top={0}
          left={0}
        />
      </Box>

      {/* Content area */}
      <Box px={4} py={3}>
        <Text
          fontWeight="bold"
          fontSize={isMobile ? "0.6rem" : isTablet ? "0.7rem" : "sm"}
          color="gray.800"
          h={"45px"}
        >
          {title}
        </Text>

        <Stack direction="row" justify="center" align="center" mb={2}>
          {oldPrice && (
            <Text
              fontSize={isMobile ? "0.6rem" : isTablet ? "0.7rem" : "sm"}
              color="gray.400"
              textDecor="line-through"
            >
              ${oldPrice}
            </Text>
          )}
          <Text
            fontSize={isMobile ? "0.6rem" : isTablet ? "0.7rem" : "sm"}
            color="pink.600"
          >
            ${price}
          </Text>
        </Stack>

        <Button
          variant="outline"
          size={"sm"}
          borderRadius="none"
          fontWeight="medium"
          fontSize={isMobile ? "0.5rem" : "xs"}
          w="100%"
          py={6}
          fontFamily={"'Work Sans', sans-serif"}
        >
          ADD TO BAG
        </Button>
      </Box>
    </MotionBox>
  );
}
