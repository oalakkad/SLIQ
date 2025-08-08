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
  const status = [
    { label: "Total Orders", number: 1250, is_currency: false },
    { label: "Total Customers", number: 340, is_currency: false },
    { label: "Revenue", number: 340.0, is_currency: true },
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
            <StatNumber>
              {stat.is_currency ? `${stat.number.toFixed(3)} KWD` : stat.number}
            </StatNumber>
          </Stat>
        ))}
      </SimpleGrid>
    </Flex>
  );
}
