"use client";

import { useAppSelector } from "@/redux/hooks";
import { Button, Flex } from "@chakra-ui/react";

interface PaginationProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export default function PaginationButtons({
  totalPages,
  page,
  setPage,
}: PaginationProps) {
  const isArabic = useAppSelector((state) => state.lang.isArabic);
  const pages = Array.from({ length: totalPages });

  return (
    <Flex
      w="100%"
      justifyContent="center"
      mt={10}
      flexDir={isArabic ? "row-reverse" : "row"}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {(isArabic ? [...pages].reverse() : pages).map((_, i) => {
        const pageNum = isArabic ? totalPages - i : i + 1;

        return (
          <Button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            mr={isArabic ? 0 : 1}
            ml={isArabic ? 1 : 0}
            border="none"
            color={page === pageNum ? "white" : "black"}
            variant={page === pageNum ? "solidPink" : "outlinePink"}
          >
            {pageNum}
          </Button>
        );
      })}
    </Flex>
  );
}
