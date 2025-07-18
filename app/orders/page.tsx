"use client";

import AccountMenu from "@/components/common/AccountMenu";
import { useOrders } from "@/hooks/use-orders";
import {
  Box,
  Heading,
  Spinner,
  Text,
  VStack,
  HStack,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Divider,
  Center,
  Badge,
} from "@chakra-ui/react";

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <Box py={20} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box py={10} bg="#fdf8f7" minH="50vh" px={[4, 8, 12]}>
      <AccountMenu />
      <Heading mb={8} fontSize="lg" color="gray.700">
        ORDERS
      </Heading>
      <Box>
        {!orders || orders.length === 0 ? (
          <Center>
            <Box
              bg="white"
              borderRadius="md"
              p={10}
              textAlign="center"
              maxW="2xl"
              w="full"
              boxShadow="sm"
            >
              <Text fontWeight="bold" fontSize="md" mb={2}>
                NO ORDERS YET
              </Text>
              <Text fontSize="sm" color="gray.600">
                Go to store to place an order.
              </Text>
            </Box>
          </Center>
        ) : (
          <Accordion allowToggle>
            {orders.map((order) => {
              const totalItems = order.items.reduce(
                (acc, item) => acc + item.quantity,
                0
              );
              const statusColor =
                order.status === "paid"
                  ? "green"
                  : order.status === "pending"
                  ? "orange"
                  : order.status === "shipped"
                  ? "blue"
                  : "red";

              return (
                <AccordionItem
                  key={order.id}
                  border="none"
                  mb={4}
                  bg="white"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <AccordionButton
                    px={6}
                    py={4}
                    _expanded={{ bg: "brand.blue" }}
                    justifyContent="space-between"
                  >
                    <Box textAlign="left">
                      <Text fontWeight="bold">Order #{order.id}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(order.created_at).toLocaleDateString()} ·{" "}
                        <Badge colorScheme={statusColor}>
                          {order.status.toUpperCase()}
                        </Badge>
                      </Text>
                    </Box>
                    <HStack spacing={4}>
                      <Text fontWeight="medium">{order.total_price} KWD</Text>
                      <Button size="sm" variant="outline">
                        Show Details
                      </Button>
                      <AccordionIcon />
                    </HStack>
                  </AccordionButton>

                  <AccordionPanel px={6} pb={6}>
                    <VStack align="stretch" spacing={4}>
                      {/* 🧾 Order Summary */}
                      <Box bg="brand.yellow" p={4} borderRadius="md">
                        <Text fontWeight="bold" mb={1}>
                          Order Summary
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Order ID: {order.id}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Created: {new Date(order.created_at).toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Items: {totalItems}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Total: {order.total_price} KWD
                        </Text>
                      </Box>

                      <Divider />

                      {/* 🛒 Items */}
                      {order.items.map((item) => (
                        <HStack key={item.id} spacing={4} align="flex-start">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            boxSize="60px"
                            borderRadius="md"
                            objectFit="cover"
                          />
                          <Box>
                            <Text fontWeight="medium">{item.product.name}</Text>
                            <Text fontSize="sm" color="gray.600">
                              Qty: {item.quantity} &middot; Price:{" "}
                              {item.price_at_purchase} KWD
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </Box>
    </Box>
  );
}
