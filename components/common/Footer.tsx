"use client";

import { useMenuCategories } from "@/hooks/use-menu-categories";
import {
  Box,
  Text,
  VStack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAppSelector } from "@/redux/hooks";
import NextLink from "next/link";

const Footer = () => {
  const { data: categories = [] } = useMenuCategories();
  const [isMobile] = useMediaQuery("(max-width: 950px)");
  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const headingFont = isArabic
    ? "var(--font-cairo), sans-serif"
    : "var(--font-readex-pro), sans-serif";

  const bodyFont = isArabic
    ? "var(--font-cairo), serif"
    : "var(--font-work-sans), serif";

  const renderProductLinks = (category: any) => {
    const showProducts = category.products.slice(0, 5);
    const hasMore = category.products.length > 5;

    return (
      <>
        {showProducts.map((product: any) => (
          <Link
            as={NextLink}
            key={product.id}
            href={`/products/${product.slug}`}
            fontSize="sm"
            color="gray.600"
            _hover={{ textDecoration: "underline" }}
            fontFamily={bodyFont}
          >
            {isArabic ? product.name_ar : product.name}
          </Link>
        ))}
        {hasMore && (
          <Link
            as={NextLink}
            href={`/category/${category.slug}`}
            fontSize="sm"
            color="#7ea2ca"
            fontWeight="medium"
            fontFamily={bodyFont}
          >
            {isArabic ? "عرض الكل" : "View All"}
          </Link>
        )}
      </>
    );
  };

  const renderCategorySection = (category: any) => (
    <VStack key={category.id} align="start" spacing={2}>
      <Link href={`/category/${category.slug}`}>
        <Text fontWeight="bold" fontSize="md" fontFamily={headingFont}>
          {isArabic ? category.name_ar : category.name}
        </Text>
      </Link>
      {renderProductLinks(category)}
    </VStack>
  );

  return (
    <Box
      bg="gray.50"
      py={10}
      px={isMobile ? 4 : "15rem"}
      dir={isArabic ? "rtl" : "ltr"}
      textAlign={isArabic ? "right" : "left"}
    >
      <VStack spacing={10} align="stretch">
        {isMobile ? (
          <Accordion allowToggle>
            {categories
              .filter((category: any) => category.id !== 4)
              .map((category: any) => (
                <AccordionItem key={category.id} border="none">
                  <h2>
                    <AccordionButton
                      _expanded={{ fontWeight: "bold" }}
                      px={4}
                      py={5}
                    >
                      <Box
                        flex="1"
                        textAlign={isArabic ? "right" : "left"}
                        fontFamily={bodyFont}
                      >
                        {isArabic ? category.name_ar : category.name}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} px={0}>
                    <VStack align="start" spacing={2} px={4}>
                      {renderProductLinks(category)}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
          </Accordion>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={10}>
            {categories
              .filter((category: any) => category.id !== 4)
              .map(renderCategorySection)}
          </SimpleGrid>
        )}

        {/* Footer Bottom */}
        <Text
          fontSize="md"
          textAlign="center"
          color="gray.500"
          fontFamily={headingFont}
          dir="ltr"
        >
          © 2025 SAIE
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
