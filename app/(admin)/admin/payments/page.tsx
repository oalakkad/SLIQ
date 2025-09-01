"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Input,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminPayments, AdminPayment } from "@/hooks/use-admin-payments";
import MyTable from "@/components/admin/MyTable";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ViewPaymentModal from "@/components/admin/ViewPaymentModal";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");

  // 🔹 Fetch payments
  const { payments, isLoading, deletePayment } = useAdminPayments(search);

  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);

  // 🔹 Local rows for inline edits or optimistic UI
  const [rows, setRows] = useState<AdminPayment[]>([]);
  useEffect(() => {
    setRows(payments || []);
  }, [payments]);

  // 🔹 Delete handler
  const handleDelete = (id: number) => {
    deletePayment.mutate(id);
  };

  // 🔹 Define columns
  const columnDefs: ColDef<AdminPayment>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      {
        headerName: "Order ID",
        valueGetter: (params) => params.data?.order?.id ?? "—",
        width: 100,
      },
      {
        headerName: "Customer",
        valueGetter: (params) => {
          const order = params.data?.order;
          if (order?.user) {
            return `${order.user.first_name ?? ""} ${order.user.last_name ?? ""}`.trim();
          }
          return order?.guest_name ?? "Guest";
        },
        flex: 2,
      },
      {
        headerName: "Email",
        valueGetter: (params) =>
          params.data?.order?.user?.email ??
          params.data?.order?.guest_email ??
          "—",
        flex: 2,
      },
      {
        headerName: "Amount",
        valueGetter: (params) =>
          `${params.data?.amount ?? "0.000"} ${params.data?.currency ?? ""}`,
        flex: 1,
      },
      { headerName: "Status", field: "status", flex: 1 },
      {
        headerName: "Paid At",
        valueGetter: (params) =>
          params.data?.paid_at
            ? new Date(params.data.paid_at).toLocaleString()
            : "—",
        flex: 2,
      },
      {
        headerName: "Created",
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
      {/* Search */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search payments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </HStack>

      {/* Content */}
      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={rows}
          columnDefs={columnDefs}
          setSelected={setSelectedPayment} // No edit modal yet
          onDelete={handleDelete}
          type="payments"
        />
      )}

    {selectedPayment && (
    <ViewPaymentModal
        payment={selectedPayment}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
    />
    )}
    </Box>
  );
}