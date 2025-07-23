"use client";

import { Box, Flex, Link, Portal } from "@chakra-ui/react";
import { motion, Variants } from "framer-motion";
import { useState, useRef } from "react";
import { AnimatedLink } from "./AnimatedLink";
import { usePathname } from "next/navigation";

const MotionBox = motion(Box);
const MotionLink = motion(Link);

const underlineVariants: Variants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 },
};

export function AnimatedLinkWithDropdown({
  item,
  isArabic,
  headingFont,
  bodyFont,
}: {
  item: any;
  isArabic: boolean;
  headingFont: string;
  bodyFont: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const dropdownMotion = {
    initial: { opacity: 0, x: isArabic ? 10 : -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isArabic ? 10 : -10 },
  };

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      w={"100%"}
      ref={triggerRef}
      position="relative"
      dir={isArabic ? "rtl" : "ltr"}
      minW={"150px"}
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
        fontFamily={headingFont}
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
          <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            bg={"transparent"}
          >
            <MotionBox
              position="absolute"
              top="170px"
              left={0}
              right={0}
              width="100%"
              bg="white"
              boxShadow="xl"
              pt={10}
              pb={4}
              px={10}
              zIndex={10}
              {...dropdownMotion}
            >
              <Flex
                justify="center"
                gap={20}
                alignItems="flex-start"
                maxW="1440px"
                mx="auto"
                flexWrap="wrap"
                flexDirection={isArabic ? "row-reverse" : "row"}
                textAlign={isArabic ? "right" : "left"}
              >
                {item.children.map((col: any) => {
                  const items = col.children || [];
                  const showViewAll = items.length > 12;
                  const firstColumnItems = items.slice(0, 6);
                  const secondColumnItems = items.slice(6, 12);
                  const columnCount = secondColumnItems.length > 0 ? 2 : 1;

                  return (
                    <Box key={col.id} minW="200px">
                      <Flex
                        justify={
                          columnCount > 1
                            ? "center"
                            : isArabic
                            ? "flex-end"
                            : "flex-start"
                        }
                      >
                        <Box mb={4}>
                          <AnimatedLink
                            name={col.name}
                            href={col.href}
                            headingFont={headingFont}
                            bodyFont={bodyFont}
                            isArabic={isArabic}
                          />
                        </Box>
                      </Flex>

                      <Flex
                        direction="row"
                        gap={10}
                        alignItems="flex-start"
                        flexDirection={isArabic ? "row-reverse" : "row"}
                      >
                        <Flex direction="column" gap={2}>
                          {firstColumnItems.map(
                            (subItem: any, index: number) => (
                              <AnimatedLink
                                href={subItem.href}
                                key={`${subItem.id}-${index}`}
                                name={subItem.name}
                                fontWeight="normal"
                                fontColor="gray"
                                isArabic={isArabic}
                                headingFont={headingFont}
                                bodyFont={bodyFont}
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
                                  fontWeight="normal"
                                  fontColor="gray"
                                  isArabic={isArabic}
                                  headingFont={headingFont}
                                  bodyFont={bodyFont}
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
                            name={isArabic ? "عرض الكل" : "View All"}
                            fontWeight="bold"
                            fontColor="gray.700"
                            isArabic={isArabic}
                            headingFont={headingFont}
                            bodyFont={bodyFont}
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
