"use client";

import { useMenuCategories } from "@/hooks/use-menu-categories";
import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

const Footer = () => {
  const { data: categories = [] } = useMenuCategories();
  const isMobile = useBreakpointValue({ base: true, md: false });

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
          >
            {product.name}
          </Link>
        ))}
        {hasMore && (
          <Link
            as={NextLink}
            href={`/category/${category.slug}`}
            fontSize="sm"
            color="#7ea2ca"
            fontWeight="medium"
          >
            View All
          </Link>
        )}
      </>
    );
  };

  const renderCategorySection = (category: any) => (
    <VStack key={category.id} align="start" spacing={2}>
      <Text fontWeight="bold" fontSize="md">
        {category.name}
      </Text>
      {renderProductLinks(category)}
    </VStack>
  );

  return (
    <Box bg="gray.50" py={10} px={{ base: 0, md: "15rem" }}>
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
                      <Box flex="1" textAlign="left">
                        {category.name}
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
          fontFamily={"'Work Sans', serif"}
        >
          © 2025 SAIE
        </Text>
      </VStack>
    </Box>
  );
};

export default Footer;
