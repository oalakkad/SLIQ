import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import NextLink from "next/link";
import { useAppSelector } from "@/redux/hooks";

const MotionDiv = motion.div;

export interface HeroBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const HeroBanner = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
}: HeroBannerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  return (
    <Box ref={ref} w="100%" h="50vh" position="relative" overflow="hidden">
      {/* Background image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage={`url(${imageSrc})`}
        bgSize="cover"
        bgPosition="center"
        zIndex={0}
      />

      {/* Optional dark overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(0, 0, 0, 0.5)"
        zIndex={1}
      />

      {/* Content */}
      <Flex
        h="100%"
        align="center"
        justify="flex-start"
        px={{ base: 6, lg: 24 }}
        position="relative"
        zIndex={2}
      >
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ width: "380px", color: "white" }}
        >
          <Text
            fontWeight="bold"
            fontSize="lg"
            mb={4}
            textAlign={"center"}
            fontFamily={headingFont}
          >
            {title}
          </Text>
          <Text
            fontSize="md"
            lineHeight="1.8"
            mb={8}
            textAlign={"justify"}
            fontFamily={bodyFont}
          >
            {description}
          </Text>

          {/* Button as a link */}
          <Flex justifyContent={"center"} w={"100%"}>
            <NextLink href={buttonLink} passHref>
              <Button
                variant="outline"
                color="white"
                borderColor="white"
                borderWidth={1.5}
                borderRadius="none"
                px={6}
                py={5}
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                fontFamily={headingFont}
                _hover={{ bg: "whiteAlpha.200" }}
              >
                {buttonText}
              </Button>
            </NextLink>
          </Flex>
        </MotionDiv>
      </Flex>
    </Box>
  );
};

export default HeroBanner;
