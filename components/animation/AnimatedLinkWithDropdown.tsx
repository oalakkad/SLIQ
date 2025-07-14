"use client";

import { Box, Flex, Link, Portal } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useState, useRef } from "react";
import { AnimatedLink } from "./AnimatedLink";

const MotionBox = motion(Box);
const MotionLink = motion(Link);

const underlineVariants: Variants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 },
};

export function AnimatedLinkWithDropdown({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={triggerRef}
      position="relative"
    >
      <MotionLink
        href={item.href}
        px={2}
        py={2}
        fontWeight="bold"
        fontSize="sm"
        color="gray.600"
        textDecoration="none"
        _hover={{ textDecoration: "none" }}
        whileHover="hover"
        initial="initial"
        animate={isOpen ? "hover" : "initial"}
        position="relative"
      >
        {item.name.toUpperCase()}

        <MotionBox
          variants={underlineVariants}
          transition={{ duration: 0.3 }}
          bg={"gray.600"}
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "2px",
            transformOrigin: "left",
          }}
        />
      </MotionLink>

      {item.children && isOpen && (
        <Portal>
          <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <MotionBox
              position="absolute"
              top="115px"
              left={0}
              right={0}
              width="100%"
              bg="white"
              boxShadow="xl"
              pt={10}
              pb={4}
              px={10}
              zIndex={10}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Flex
                justify="center"
                gap={20}
                alignItems="flex-start"
                maxW="1440px"
                mx="auto"
                flexWrap={"wrap"}
              >
                {item.children.map((col: any) => {
                  const items = col.children || [];
                  const showViewAll = items.length > 12;
                  const firstColumnItems = items.slice(0, 6);
                  const secondColumnItems = items.slice(6, 12);
                  const columnCount = secondColumnItems.length > 0 ? 2 : 1;

                  return (
                    <Box key={col.id} minW="200px">
                      <Flex justify={columnCount > 1 ? "center" : "flex-start"}>
                        <Box mb={4}>
                          <AnimatedLink name={col.name} href={col.href} />
                        </Box>
                      </Flex>
                      <Flex direction="row" gap={10} alignItems="flex-start">
                        <Flex direction="column" gap={2}>
                          {firstColumnItems.map(
                            (subItem: any, index: number) => (
                              <AnimatedLink
                                href={subItem.href}
                                key={`${subItem.id}-${index}`}
                                name={subItem.name}
                                fontWeight={"normal"}
                                fontColor="gray"
                              />
                            )
                          )}
                        </Flex>
                        {secondColumnItems.length > 0 && (
                          <Flex direction="column" gap={2}>
                            {secondColumnItems.map(
                              (subItem: any, index: number) => (
                                <AnimatedLink
                                  href={subItem.href}
                                  key={`${subItem.id}-${index}`}
                                  name={subItem.name}
                                  fontWeight={"normal"}
                                  fontColor="gray"
                                />
                              )
                            )}
                          </Flex>
                        )}
                      </Flex>
                      {showViewAll && (
                        <Flex mt={2} justify="center">
                          <AnimatedLink
                            href={col.href}
                            key={`${col.id}-viewAll`}
                            name={"View All"}
                            fontWeight={"bold"}
                            fontColor="gray.700"
                          />
                        </Flex>
                      )}
                    </Box>
                  );
                })}
              </Flex>
            </MotionBox>
          </Box>
        </Portal>
      )}
    </Box>
  );
}
