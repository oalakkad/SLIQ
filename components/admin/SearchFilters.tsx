// components/SearchFilters.tsx
"use client";

import { Flex, Input, Select, Button } from "@chakra-ui/react";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  filterOptions?: string[];
}

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  return (
    <Flex gap={4} mb={6}>
      <Input
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        maxW="300px"
      />
      <Button colorScheme="brandPink">Apply</Button>
    </Flex>
  );
}
