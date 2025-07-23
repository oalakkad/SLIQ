"use client"; // Only for Next.js App Router

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setArabic, setEnglish } from "@/redux/features/langSlice";

export default function LanguageSelector() {
  const dispatch = useAppDispatch();
  const isArabic = useAppSelector((state) => state.lang.isArabic);

  const languages = [
    {
      code: "en",
      label: "English",
      onSelect: () => dispatch(setEnglish()),
    },
    {
      code: "ar",
      label: "Arabic",
      onSelect: () => dispatch(setArabic()),
    },
  ];

  const current = isArabic ? languages[1] : languages[0];

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <HStack spacing={2}>
          <Text>{current.label}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {languages.map((lang) => (
          <MenuItem key={lang.code} onClick={lang.onSelect}>
            <HStack spacing={3}>
              <Text>{lang.label}</Text>
            </HStack>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
