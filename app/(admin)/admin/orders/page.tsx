"use client";

import { useState, useMemo, useEffect } from "react";
import { Box, Input, Select, HStack, Text } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminOrders, AdminOrder } from "@/hooks/use-admin-orders";
import EditOrderModal from "@/components/admin/EditOrderModal";
import MyTable from "@/components/admin/MyTable";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // 🔹 Fetch orders
  const { orders, isLoading, deleteOrder } = useAdminOrders(
    search,
    status ? { status } : undefined
  );

  // 🔹 Local rows for inline edits or optimistic UI
  const [rows, setRows] = useState<AdminOrder[]>([]);
  useEffect(() => {
    setRows(orders || []);
  }, [orders]);

  // 🔹 Delete handler
  const handleDelete = (id: number) => {
    deleteOrder.mutate(id);
  };

  // 🔹 Define columns
  const columnDefs: ColDef<AdminOrder>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      {
        headerName: "Customer",
        valueGetter: (params) =>
          `${params.data?.user.first_name ?? ""} ${
            params.data?.user.last_name ?? ""
          }`,
        flex: 2,
      },
      {
        headerName: "Email",
        valueGetter: (params) => params.data?.user.email ?? "",
        flex: 2,
      },
      { headerName: "Status", field: "status", flex: 2 },
      {
        headerName: "Total (KWD)",
        valueGetter: (params) => `${params.data?.total_price ?? "0.000"} KWD`,
        flex: 2,
      },
      {
        headerName: "Date",
        valueGetter: (params) =>
          params.data?.created_at
            ? new Date(params.data.created_at).toLocaleDateString()
            : "—",
        flex: 2,
      },
    ],
    []
  );

  // 🔹 Loading state
  if (isLoading) {
    return <Box p={6}>Loading orders...</Box>;
  }

  // 🔹 No data fallback
  if (!rows || rows.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="md" shadow="sm" minH="100vh" w="100%">
        <HStack mb={4} spacing={4}>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            placeholder="Filter by status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </Select>
        </HStack>
        <Text mt={10} textAlign="center" fontSize="lg" color="gray.500">
          No orders found
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      {/* Search & Filters */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </Select>
      </HStack>

      {/* AG Grid */}
      <MyTable
        rowData={rows}
        columnDefs={columnDefs}
        setSelected={setSelectedOrder}
        onDelete={handleDelete}
      />

      {/* Edit Modal */}
      {selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Box>
  );
}
