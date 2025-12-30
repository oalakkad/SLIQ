"use client";

import { Box, Flex, Image, useMediaQuery } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export interface ThreeImagesProps {
  src: string;
  alt: string;
}

interface Props {
  images: ThreeImagesProps[];
}

const MotionBox = motion(Box);

export default function ThreeImages({ images }: Props) {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <Box ref={ref}>
      <MotionBox
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        overflowX={isMobile ? "auto" : "visible"}
        width="100%"
        scrollBehavior="smooth"
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
        px={10}
      >
        <Flex minWidth={isMobile ? "max-content" : "100%"} gap={4}>
          {images.map((image) => (
            <Box
              key={image.src}
              flexShrink={0}
              width={isMobile ? "250px" : "33.33%"}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width="100%"
                height="auto"
                maxH={"65vh"}
                minH={"300px"}
                objectFit="cover"
                borderRadius="md"
              />
            </Box>
          ))}
        </Flex>
      </MotionBox>
    </Box>
  );
}
