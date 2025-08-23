"use client";

import { SortKey } from "@/hooks/use-products";
import { useAppSelector } from "@/redux/hooks";
import { Button, Flex, Select } from "@chakra-ui/react";
import { useEffect } from "react";

interface PageSortProps {
  bodyFont: any;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
  isArabic: boolean;
  isMobile: boolean;
}

export default function PageSort({
  bodyFont,
  sort,
  setSort,
  isArabic,
  isMobile,
}: PageSortProps) {
  return (
    <Select
      placeholder={isArabic ? "فرز حسب" : "SORT BY"}
      size="lg"
      w={isMobile ? "150px" : "250px"}
      borderRadius={0}
      border={"none"}
      color={"gray.400"}
      fontWeight={300}
      cursor={"pointer"}
      fontFamily={bodyFont}
      variant={"filled"}
      h={"45px"}
      bg="white"
      value={sort}
      style={{ paddingTop: "0" }}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.currentTarget.value as SortKey | "";
        setSort(v || undefined); // "" -> undefined, others unchanged
      }}
    >
      <option value="featured">{isArabic ? "مميز" : "FEATURED"}</option>
      <option value="price-lth">
        {isArabic ? "السعر من الأقل إلى الأعلى" : "PRICE, LOW TO HIGH"}
      </option>
      <option value="price-htl">
        {isArabic ? "السعر من الأعلى إلى الأقل" : "PRICE, HIGH TO LOW"}
      </option>
    </Select>
  );
}
