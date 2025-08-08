"use client";

import React, { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Text,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { useProductAddons } from "@/hooks/use-product-addons";

interface ProductAddonSelectorProps {
  productId: number;
  isArabic?: boolean;
  onSelectionChange?: (selected: Record<number, number[]>) => void;
  // Shape: { [categoryId]: [selectedOptionIds] }
}

const ProductAddonSelector: React.FC<ProductAddonSelectorProps> = ({
  productId,
  isArabic = false,
  onSelectionChange,
}) => {
  const { data: categories, isLoading, isError } = useProductAddons(productId);

  // Track selections: categoryId -> array of selected option IDs
  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, number[]>
  >({});

  if (isLoading) return <Text>Loading add-ons...</Text>;
  if (isError) return <Text>Failed to load add-ons.</Text>;
  if (!categories || categories.length === 0)
    return <Text>No add-ons available.</Text>;

  const handleSelection = (categoryId: number, optionIds: number[]) => {
    const updatedSelections = {
      ...selectedOptions,
      [categoryId]: optionIds,
    };
    setSelectedOptions(updatedSelections);
    onSelectionChange?.(updatedSelections);
  };

  return (
    <VStack align="stretch" spacing={6}>
      {categories
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)) // ✅ Sort categories alphabetically
        .map((category) => (
          <Box
            key={category.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            shadow="sm"
          >
            <Heading size="md" mb={3} textAlign={isArabic ? "right" : "left"}>
              {isArabic && category.name_ar ? category.name_ar : category.name}
            </Heading>

            {category.addons.length === 0 ? (
              <Text color="gray.500">No add-ons in this category</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                {category.addons.map((addon) => (
                  <Box key={addon.id}>
                    <Text
                      fontWeight="semibold"
                      mb={2}
                      textAlign={isArabic ? "right" : "left"}
                    >
                      {isArabic && addon.name_ar ? addon.name_ar : addon.name}{" "}
                      <Text as="span" color="gray.500" fontSize="sm">
                        (${addon.price})
                      </Text>
                    </Text>

                    {addon.allow_multiple_options ? (
                      <CheckboxGroup
                        value={selectedOptions[category.id] || []}
                        onChange={(values) =>
                          handleSelection(
                            category.id,
                            values.map((v) => Number(v))
                          )
                        }
                      >
                        <Stack direction="column" spacing={2}>
                          {addon.options.map((option) => (
                            <Checkbox
                              key={option.id}
                              value={option.id}
                              textAlign={isArabic ? "right" : "left"}
                            >
                              {isArabic && option.name_ar
                                ? option.name_ar
                                : option.name}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    ) : (
                      <RadioGroup
                        value={
                          selectedOptions[category.id]?.[0]
                            ? selectedOptions[category.id][0].toString()
                            : ""
                        }
                        onChange={(value) =>
                          handleSelection(category.id, [Number(value)])
                        }
                      >
                        <Stack direction="column" spacing={2}>
                          {addon.options.map((option) => (
                            <Radio
                              key={option.id}
                              value={option.id.toString()}
                              textAlign={isArabic ? "right" : "left"}
                            >
                              {isArabic && option.name_ar
                                ? option.name_ar
                                : option.name}
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    )}
                  </Box>
                ))}
              </VStack>
            )}

            <Divider mt={4} />
          </Box>
        ))}
    </VStack>
  );
};

export default ProductAddonSelector;
