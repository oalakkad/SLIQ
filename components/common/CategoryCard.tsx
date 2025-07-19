import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

export interface CategoryCardProps {
  title: string;
  imageUrl: string;
  href: string;
}

// Define Framer Motion variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Cast Chakra Box to a motion-enabled component
const MotionBox = motion(Box);

const CategoryCard = ({ title, imageUrl, href }: CategoryCardProps) => {
  return (
    <MotionBox
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      position="relative"
      overflow="hidden"
      aspectRatio={3 / 4}
      w="full"
      cursor="pointer"
      role="group"
    >
      {/* Image container with zoom on hover */}
      <MotionBox
        backgroundImage={`url(${imageUrl})`}
        backgroundSize="cover"
        backgroundPosition="center"
        width="100%"
        height="100%"
        transition={{ duration: 0.3, ease: "easeOut" }}
        _groupHover={{ transform: "scale(1.05)" }}
      />

      {/* Button-like text box */}
      <Link href={href}>
        <Flex
          w="100%"
          position="absolute"
          bottom="16px"
          justifyContent="center"
        >
          <Box bg="white" w="85%" px={2} py={2} boxShadow="md">
            <Text
              fontWeight="semibold"
              letterSpacing="wide"
              fontSize="sm"
              color="gray.700"
              _groupHover={{ color: "black" }}
              textAlign="center"
            >
              {title}
            </Text>
          </Box>
        </Flex>
      </Link>
    </MotionBox>
  );
};

export default CategoryCard;
