"use client";

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

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant={"ghost"}>
        <HStack spacing={2}>
          <Text fontSize="sm">{isArabic ? "العربية" : "English"}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem
          onClick={() => dispatch(setEnglish())}
          fontWeight={!isArabic ? "bold" : "normal"}
          bg={!isArabic ? "gray.100" : "transparent"}
        >
          <Text fontSize="sm">English</Text>
        </MenuItem>
        <MenuItem
          onClick={() => dispatch(setArabic())}
          fontWeight={isArabic ? "bold" : "normal"}
          bg={isArabic ? "gray.100" : "transparent"}
        >
          <Text fontSize="sm">العربية</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
