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
  Stack,
} from "@chakra-ui/react";

// ----- Types you can reuse across app -----
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
  price: number; // base price for the addon (if any)
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

// Selection payload per category
export interface SelectedAddonForCategory {
  categoryId: number;
  addonId: number | null;
  optionIds: number[]; // empty if none selected
  customName?: string | null; // only if requires_custom_name
}

// Component props
interface AddonsSelectorProps {
  categories: AddonCategory[];
  value?: SelectedAddonForCategory[]; // controlled initial value (optional)
  onChange?: (selection: SelectedAddonForCategory[]) => void;
  showPrices?: boolean;
  isArabic?: boolean;
}

// ----- Helpers -----
const formatKwd = (n: number) => `${Number(n).toFixed(3)} KWD`;
const displayName = (isAr: boolean, name: string, name_ar?: string) =>
  isAr && name_ar ? name_ar : name;

// compute total “extra” for a chosen addon entry (base addon price + options)
function computeAddonTotal(addon: Addon, chosenOptionIds: number[]): number {
  const optsTotal = addon.options
    .filter((o) => chosenOptionIds.includes(o.id))
    .reduce((acc, o) => acc + Number(o.price || 0), 0);
  return Number(addon.price || 0) + optsTotal;
}

// i18n strings
const strings = (ar: boolean) => ({
  selected: ar ? "المحدد:" : "Selected:",
  selectOne: ar ? "اختر واحدًا" : "Select one",
  configure: ar ? "إعداد الخيارات" : "Configure options",
  customName: ar ? "اسم مخصص" : "Custom name",
  customNamePlaceholder: ar ? "اكتبي اسمًا مخصصًا" : "Type a custom name",
  noOptions: ar ? "لا توجد خيارات لهذا الإضافة." : "No options for this addon.",
  subtotal: ar ? "المجموع الفرعي لهذه الإضافة" : "Subtotal for this addon",
});

export default function AddonsSelector({
  categories,
  value,
  onChange,
  showPrices = true,
  isArabic = false,
}: AddonsSelectorProps) {
  const t = strings(isArabic);

  // internal controlled state -> one selection per category
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

  // keep internal state in sync if parent passes new value
  useEffect(() => {
    if (value) setSelection(value);
  }, [value]);

  // emit changes upward
  const emit = (next: SelectedAddonForCategory[]) => {
    setSelection(next);
    onChange?.(next);
  };

  // lookup helpers
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
            optionIds: [], // reset options when switching addons
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
    const next = selection.map((s) =>
      s.categoryId === categoryId
        ? {
            ...s,
            optionIds: addon.allow_multiple_options
              ? nextOptionIds
              : nextOptionIds.slice(0, 1),
          }
        : s
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

        return (
          <Box key={cat.id} borderWidth="1px" borderRadius="md" p={4}>
            <HStack justify="space-between" mb={3} wrap="wrap">
              <Text
                fontSize="lg"
                fontWeight="bold"
                textAlign={isArabic ? "right" : "left"}
              >
                {catDisplayName}
              </Text>

              {sel.addonId ? (
                <Text
                  fontSize="sm"
                  color="gray.600"
                  textAlign={isArabic ? "right" : "left"}
                >
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
                <Text
                  fontSize="sm"
                  color="gray.500"
                  textAlign={isArabic ? "right" : "left"}
                >
                  {t.selectOne}
                </Text>
              )}
            </HStack>

            {/* One addon per category */}
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
                          <Radio value={String(addon.id)} />
                          <VStack
                            align={isArabic ? "end" : "start"}
                            spacing={0}
                          >
                            <Text
                              fontWeight="semibold"
                              textAlign={isArabic ? "right" : "left"}
                            >
                              {addonName}
                            </Text>
                          </VStack>
                        </HStack>

                        {showPrices && (
                          <Text fontWeight="medium">
                            {formatKwd(Number(chosenTotal))}
                          </Text>
                        )}
                      </HStack>

                      {/* Options + custom name in an accordion row */}
                      <Accordion
                        allowToggle
                        index={isSelected ? 0 : undefined}
                        mt={2}
                      >
                        {addon.options.length > 0 && (
                          <AccordionItem isDisabled={!isSelected}>
                            <h2>
                              <AccordionButton>
                                <Box
                                  as="span"
                                  flex="1"
                                  textAlign={isArabic ? "right" : "left"}
                                >
                                  {t.configure}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                              <VStack align="stretch" spacing={3}>
                                {addon.requires_custom_name && (
                                  <Box>
                                    <Text
                                      fontSize="sm"
                                      mb={1}
                                      textAlign={isArabic ? "right" : "left"}
                                    >
                                      {t.customName}
                                    </Text>
                                    <Input
                                      placeholder={t.customNamePlaceholder}
                                      dir={isArabic ? "rtl" : "ltr"}
                                      value={sel.customName ?? ""}
                                      onChange={(e) =>
                                        handleCustomName(cat.id, e.target.value)
                                      }
                                    />
                                  </Box>
                                )}

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
                                                <Stack spacing={0}>
                                                  <Text
                                                    textAlign={
                                                      isArabic
                                                        ? "right"
                                                        : "left"
                                                    }
                                                  >
                                                    {optName}
                                                  </Text>
                                                </Stack>
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
                                                <Stack spacing={0}>
                                                  <Text
                                                    textAlign={
                                                      isArabic
                                                        ? "right"
                                                        : "left"
                                                    }
                                                  >
                                                    {optName}
                                                  </Text>
                                                </Stack>
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
                                  <Text
                                    fontSize="sm"
                                    color="gray.500"
                                    textAlign={isArabic ? "right" : "left"}
                                  >
                                    {t.noOptions}
                                  </Text>
                                )}

                                {showPrices && isSelected && (
                                  <>
                                    <Divider />
                                    <HStack justify="space-between">
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        textAlign={isArabic ? "right" : "left"}
                                      >
                                        {t.subtotal}
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
                        )}
                      </Accordion>
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
