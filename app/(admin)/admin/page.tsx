"use client";
import { useAdminStats } from "@/hooks/use-admin-stats";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

export default function AdminHome() {
  const { stats, totalRevenueNumber, isLoading, isError, refetch } =
    useAdminStats();
  const status = [
    { label: "Total Orders", number: stats?.orders_count },
    {
      label: "Total Customers",
      number: stats?.users_count,
    },
    {
      label: "Revenue",
      number: Number(totalRevenueNumber).toFixed(3),
    },
  ];
  return (
    <Flex direction="column" w={"100%"}>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} w={"100%"} spacing={4}>
        {status.map((stat, index) => (
          <Stat
            p={4}
            bg="white"
            shadow="sm"
            key={`${stat.label}-${index}`}
            borderRadius="md"
            flex={"1"}
            justifyContent={"center"}
            display={"flex"}
            textAlign={"center"}
          >
            <StatLabel>{stat.label}</StatLabel>
            <StatNumber>{stat.number}</StatNumber>
          </Stat>
        ))}
      </SimpleGrid>
    </Flex>
  );
}
