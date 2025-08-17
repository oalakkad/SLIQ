"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Input,
  Select,
  HStack,
  Text,
  Spinner,
  Button,
} from "@chakra-ui/react";
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

  // 🔹 Fetch orders
  const { orders, isLoading, deleteOrder } = useAdminOrders(search);

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

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      {/* Search & Filters */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button>Add</Button>
      </HStack>

      {/* Content area */}
      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={rows}
          columnDefs={columnDefs}
          setSelected={setSelectedOrder}
          onDelete={handleDelete}
          type="orders"
        />
      )}

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
