import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MotionDiv = motion.div;

export interface AboutSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const AboutSection = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageSrc,
}: AboutSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <Flex
      ref={ref}
      direction={{ base: "column", md: "row" }}
      w="100%"
      mt={10}
      bg="#efe7e2"
      overflow="hidden"
    >
      {/* Animated Image */}
      <MotionDiv
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{ flex: 1 }}
      >
        <Box position="relative" h={{ base: "300px", md: "auto" }}>
          <Image
            src={imageSrc}
            alt={title}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        </Box>
      </MotionDiv>

      {/* Animated Text */}
      <MotionDiv
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Flex
          direction="column"
          justify="center"
          px={{ base: 6, md: 16 }}
          py={{ base: 10, md: 0 }}
          bg="#efe7e2"
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            mb={4}
            color="gray.700"
            fontFamily={"Readex Pro"}
          >
            {title}
          </Text>
          <Text
            fontSize="md"
            color="gray.700"
            maxW="480px"
            mb={8}
            fontFamily={"Work Sans"}
          >
            {description}
          </Text>
          <Link href={buttonLink} passHref>
            <Button
              variant="outline"
              bg="white"
              color="gray.800"
              borderRadius="none"
              px={6}
              py={5}
              fontSize="xs"
              fontWeight="bold"
              textTransform="uppercase"
              border="none"
              fontFamily={"Readex Pro"}
              _hover={{ bg: "gray.100" }}
            >
              {buttonText}
            </Button>
          </Link>
        </Flex>
      </MotionDiv>
    </Flex>
  );
};

export default AboutSection;
