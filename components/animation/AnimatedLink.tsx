import { Link, Box } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import type { ComponentProps } from "react";

// Create motion components
const MotionLink = motion(Link);
const MotionBox = motion(Box);

// Define animation variants
const underlineVariants: Variants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 },
};

// Explicit props (don't extend Chakra's LinkProps directly)
interface AnimatedLinkProps {
  name: string;
  href: string;
}

export function AnimatedLink({ name, href }: AnimatedLinkProps) {
  return (
    <Box position="relative">
      <MotionLink
        href={href}
        position="relative"
        textDecoration="none"
        px={2}
        py={2}
        color="black"
        _hover={{ textDecoration: "none" }}
        whileHover="hover"
        fontWeight="bold"
        initial="initial"
        fontSize="sm"
        mr={4}
      >
        {name.toUpperCase()}
        <MotionBox
          variants={underlineVariants}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "black",
            transformOrigin: "left",
          }}
        />
      </MotionLink>
    </Box>
  );
}
