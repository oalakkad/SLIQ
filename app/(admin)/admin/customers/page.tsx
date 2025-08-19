"use client";

import { useState, useMemo } from "react";
import { Box, Button, HStack, Input, Spinner } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminCustomers, AdminCustomer } from "@/hooks/use-admin-customers";
import SearchFilters from "@/components/admin/SearchFilters";
import MyTable from "@/components/admin/MyTable";
import EditCustomerModal from "@/components/admin/EditCustomerModal";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);

  const { customers, isLoading, deleteCustomer } = useAdminCustomers(search);

  // 🔹 Define AG Grid Columns
  const columnDefs: ColDef<AdminCustomer>[] = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: (params) => {
          const index = params.node?.rowIndex ?? 0;
          return index + 1;
        },
        width: 80,
      },
      {
        headerName: "Name",
        valueGetter: (params) =>
          `${params.data?.first_name ?? ""} ${params.data?.last_name ?? ""}`,
        flex: 2,
      },
      { headerName: "Email", field: "email", flex: 2 },
      {
        headerName: "Date Joined",
        valueGetter: (params) =>
          params.data?.date_joined
            ? new Date(params.data.date_joined).toLocaleDateString()
            : "—",
        flex: 2,
      },
    ],
    []
  );

  const handleDelete = (id: number) => {
    deleteCustomer.mutate(id);
  };

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </HStack>
      {/* AG Grid Table */}
      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={customers}
          columnDefs={columnDefs}
          setSelected={setSelectedCustomer}
          onDelete={handleDelete}
          type="customers"
        />
      )}

      {/* Edit Customer Modal */}
      {selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </Box>
  );
}
