"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Input,
  Divider,
} from "@chakra-ui/react";

// ----- Types -----
export interface AddonOption {
  id: number;
  name: string;
  name_ar?: string;
  price: number; // extra price
}

export interface Addon {
  id: number;
  name: string;
  name_ar?: string;
  price: number; // base price
  requires_custom_name?: boolean;
  allow_multiple_options: boolean;
  options: AddonOption[];
}

export interface AddonCategory {
  id: number;
  name: string;
  name_ar?: string;
  addons: Addon[];
}

export interface SelectedAddonForCategory {
  categoryId: number;
  addonId: number | null;
  optionIds: number[];
  customName?: string | null;
}

interface AddonsSelectorProps {
  categories: AddonCategory[];
  value?: SelectedAddonForCategory[];
  onChange?: (selection: SelectedAddonForCategory[]) => void;
  showPrices?: boolean;
  isArabic?: boolean;
  /** Per-category error messages (from parent validation) */
  errors?: Record<number, string>;
}

// ----- Helpers -----
const formatKwd = (n: number) => `${Number(n).toFixed(3)} KWD`;
const displayName = (isAr: boolean, name: string, name_ar?: string) =>
  isAr && name_ar ? name_ar : name;

function computeAddonTotal(addon: Addon, chosenOptionIds: number[]): number {
  const optsTotal = addon.options
    .filter((o) => chosenOptionIds.includes(o.id))
    .reduce((acc, o) => acc + Number(o.price || 0), 0);
  return Number(addon.price || 0) + optsTotal;
}

const strings = (ar: boolean) => ({
  selected: ar ? "المحدد:" : "Selected:",
  selectOne: ar ? "اختر واحدًا" : "Select one",
  configure: ar ? "إعداد الخيارات" : "Configure options",
  customName: ar ? "اسم مخصص" : "Custom name",
  customNamePlaceholder: ar ? "اكتبي اسمًا مخصصًا" : "Type a custom name",
  noOptions: ar ? "لا توجد خيارات لهذا الإضافة." : "No options for this addon.",
});

export default function AddonsSelector({
  categories,
  value,
  onChange,
  showPrices = true,
  isArabic = false,
  errors = {},
}: AddonsSelectorProps) {
  const t = strings(isArabic);

  const [selection, setSelection] = useState<SelectedAddonForCategory[]>(
    () =>
      value ??
      categories.map((c) => ({
        categoryId: c.id,
        addonId: null,
        optionIds: [],
        customName: null,
      }))
  );

  useEffect(() => {
    if (value) setSelection(value);
  }, [value]);

  // If categories change (e.g., different product), reset shape
  useEffect(() => {
    if (!value) {
      setSelection(
        categories.map((c) => ({
          categoryId: c.id,
          addonId: null,
          optionIds: [],
          customName: null,
        }))
      );
    }
  }, [categories, value]);

  const emit = (next: SelectedAddonForCategory[]) => {
    setSelection(next);
    onChange?.(next);
  };

  const byCategoryId = useMemo(() => {
    const map = new Map<number, SelectedAddonForCategory>();
    selection.forEach((s) => map.set(s.categoryId, s));
    return map;
  }, [selection]);

  const handleSelectAddon = (categoryId: number, addonIdStr: string) => {
    const addonId = Number(addonIdStr);
    const next = selection.map((s) =>
      s.categoryId === categoryId
        ? {
            categoryId,
            addonId,
            optionIds: [],
            customName: null,
          }
        : s
    );
    emit(next);
  };

  const handleToggleOption = (
    categoryId: number,
    addon: Addon,
    nextOptionIds: number[]
  ) => {
    let limitedOptionIds = nextOptionIds;

    if (addon.allow_multiple_options) {
      if (limitedOptionIds.length > 2) {
        limitedOptionIds = limitedOptionIds.slice(0, 2);
      }
    } else {
      limitedOptionIds = limitedOptionIds.slice(0, 1);
    }

    const next = selection.map((s) =>
      s.categoryId === categoryId ? { ...s, optionIds: limitedOptionIds } : s
    );
    emit(next);
  };

  const handleCustomName = (categoryId: number, val: string) => {
    const next = selection.map((s) =>
      s.categoryId === categoryId ? { ...s, customName: val } : s
    );
    emit(next);
  };

  return (
    <VStack spacing={6} align="stretch" dir={isArabic ? "rtl" : "ltr"}>
      {categories.map((cat) => {
        const catDisplayName = displayName(isArabic, cat.name, cat.name_ar);

        const sel = byCategoryId.get(cat.id) ?? {
          categoryId: cat.id,
          addonId: null,
          optionIds: [],
          customName: null,
        };

        const selectedAddon = cat.addons.find((a) => a.id === sel.addonId);
        const catError = errors[cat.id];

        return (
          <Box key={cat.id} borderWidth="1px" borderRadius="md" p={4}>
            <HStack justify="space-between" mb={2} wrap="wrap">
              <Text fontSize="lg" fontWeight="bold">
                {catDisplayName}
              </Text>

              {sel.addonId ? (
                <Text fontSize="sm" color="gray.600">
                  {t.selected}{" "}
                  <strong>
                    {selectedAddon
                      ? displayName(
                          isArabic,
                          selectedAddon.name,
                          selectedAddon.name_ar
                        )
                      : ""}
                  </strong>
                </Text>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  {t.selectOne}
                </Text>
              )}
            </HStack>

            {/* 🔴 Inline error for this category */}
            {catError && (
              <Text fontSize="sm" color="brandPink" mb={2}>
                {catError}
              </Text>
            )}

            <RadioGroup
              value={sel.addonId ? String(sel.addonId) : ""}
              onChange={(val) => handleSelectAddon(cat.id, val)}
            >
              <VStack align="stretch" spacing={3}>
                {cat.addons.map((addon) => {
                  const addonName = displayName(
                    isArabic,
                    addon.name,
                    addon.name_ar
                  );
                  const isSelected = addon.id === sel.addonId;
                  const chosenTotal = isSelected
                    ? computeAddonTotal(addon, sel.optionIds)
                    : addon.price || 0;

                  return (
                    <Box
                      key={addon.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={3}
                    >
                      <HStack justify="space-between" align="center">
                        <HStack>
                          <Radio
                            value={String(addon.id)}
                            colorScheme="brandBlue"
                          />
                          <VStack
                            align={isArabic ? "end" : "start"}
                            spacing={0}
                          >
                            <Text fontWeight="semibold">{addonName}</Text>
                          </VStack>
                        </HStack>

                        {showPrices && (
                          <Text fontWeight="medium">
                            {formatKwd(Number(chosenTotal))}
                          </Text>
                        )}
                      </HStack>

                      {/* Accordion if addon has options OR requires custom name */}
                      {(addon.requires_custom_name ||
                        addon.options.length > 0) && (
                        <Accordion
                          allowToggle
                          index={isSelected ? 0 : undefined}
                          mt={2}
                        >
                          <AccordionItem isDisabled={!isSelected}>
                            <h2>
                              <AccordionButton>
                                <Box
                                  as="span"
                                  flex="1"
                                  textAlign={isArabic ? "right" : "left"}
                                >
                                  {/* a11y hint: configure */}
                                  {isArabic
                                    ? "إعداد الخيارات"
                                    : "Configure options"}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <VStack align="stretch" spacing={3}>
                                {/* ✅ Always render custom name if required */}
                                {addon.requires_custom_name && (
                                  <Box>
                                    <Text fontSize="sm" mb={1}>
                                      {isArabic ? "اسم مخصص" : "Custom name"}
                                    </Text>
                                    <Input
                                      placeholder={
                                        isArabic
                                          ? "اكتبي اسمًا مخصصًا"
                                          : "Type a custom name"
                                      }
                                      dir={isArabic ? "rtl" : "ltr"}
                                      value={sel.customName ?? ""}
                                      onChange={(e) =>
                                        handleCustomName(cat.id, e.target.value)
                                      }
                                    />
                                  </Box>
                                )}

                                {/* Options */}
                                {addon.options.length > 0 ? (
                                  addon.allow_multiple_options ? (
                                    <CheckboxGroup
                                      value={sel.optionIds.map(String)}
                                      onChange={(vals) =>
                                        handleToggleOption(
                                          cat.id,
                                          addon,
                                          (vals as string[]).map(Number)
                                        )
                                      }
                                    >
                                      <VStack align="stretch" spacing={2}>
                                        {addon.options.map((opt) => {
                                          const optName = displayName(
                                            isArabic,
                                            opt.name,
                                            opt.name_ar
                                          );
                                          return (
                                            <HStack
                                              key={opt.id}
                                              justify="space-between"
                                            >
                                              <Checkbox value={String(opt.id)}>
                                                <Text>{optName}</Text>
                                              </Checkbox>
                                              {showPrices && (
                                                <Text fontSize="sm">
                                                  +{" "}
                                                  {formatKwd(
                                                    Number(opt.price || 0)
                                                  )}
                                                </Text>
                                              )}
                                            </HStack>
                                          );
                                        })}
                                      </VStack>
                                    </CheckboxGroup>
                                  ) : (
                                    <RadioGroup
                                      value={
                                        sel.optionIds[0]
                                          ? String(sel.optionIds[0])
                                          : ""
                                      }
                                      onChange={(val) =>
                                        handleToggleOption(cat.id, addon, [
                                          Number(val),
                                        ])
                                      }
                                    >
                                      <VStack align="stretch" spacing={2}>
                                        {addon.options.map((opt) => {
                                          const optName = displayName(
                                            isArabic,
                                            opt.name,
                                            opt.name_ar
                                          );
                                          return (
                                            <HStack
                                              key={opt.id}
                                              justify="space-between"
                                            >
                                              <Radio value={String(opt.id)}>
                                                <Text>{optName}</Text>
                                              </Radio>
                                              {showPrices && (
                                                <Text fontSize="sm">
                                                  +{" "}
                                                  {formatKwd(
                                                    Number(opt.price || 0)
                                                  )}
                                                </Text>
                                              )}
                                            </HStack>
                                          );
                                        })}
                                      </VStack>
                                    </RadioGroup>
                                  )
                                ) : (
                                  !addon.requires_custom_name && (
                                    <Text fontSize="sm" color="gray.500">
                                      {isArabic
                                        ? "لا توجد خيارات لهذا الإضافة."
                                        : "No options for this addon."}
                                    </Text>
                                  )
                                )}

                                {/* Subtotal */}
                                {showPrices && isSelected && (
                                  <>
                                    <Divider />
                                    <HStack justify="space-between">
                                      <Text fontSize="sm" color="gray.600">
                                        {isArabic
                                          ? "المجموع الفرعي لهذه الإضافة"
                                          : "Subtotal for this addon"}
                                      </Text>
                                      <Text fontWeight="semibold">
                                        {formatKwd(Number(chosenTotal))}
                                      </Text>
                                    </HStack>
                                  </>
                                )}
                              </VStack>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </RadioGroup>
          </Box>
        );
      })}
    </VStack>
  );
}
