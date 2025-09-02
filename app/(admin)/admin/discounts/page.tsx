"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Input,
  HStack,
  Text,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminDiscounts, AdminDiscount } from "@/hooks/use-admin-discounts";
import MyTable from "@/components/admin/MyTable";
import { EditDiscountModal } from "@/components/admin/EditDiscountModal";

export default function DiscountsPage() {
  const [search, setSearch] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState<AdminDiscount | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toast = useToast();

  // 🔹 Fetch discounts
  const {
    discounts,
    isLoading,
    deleteDiscount,
    createDiscount,
    updateDiscount,
  } = useAdminDiscounts(search);

  // 🔹 Delete
  const handleDelete = (id: number) => {
    deleteDiscount.mutate(id, {
      onSuccess: () =>
        toast({ title: "Discount deleted", status: "success", duration: 2000 }),
      onError: () =>
        toast({
          title: "Failed to delete discount",
          status: "error",
          duration: 2000,
        }),
    });
  };

  // 🔹 Submit (create / update)
  const handleSubmitDiscount = (data: any) => {
    if (selectedDiscount) {
      updateDiscount.mutate(
        { id: selectedDiscount.id, data },
        {
          onSuccess: () => {
            toast({
              title: "Discount updated",
              status: "success",
              duration: 2000,
            });
            setSelectedDiscount(null);
          },
          onError: () =>
            toast({
              title: "Failed to update discount",
              status: "error",
              duration: 2000,
            }),
        }
      );
    } else {
      createDiscount.mutate(data, {
        onSuccess: () => {
          toast({
            title: "Discount created",
            status: "success",
            duration: 2000,
          });
          setIsAddModalOpen(false);
        },
        onError: () =>
          toast({
            title: "Failed to create discount",
            status: "error",
            duration: 2000,
          }),
      });
    }
  };

  // 🔹 Columns
  const columnDefs: ColDef<AdminDiscount>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      { headerName: "Code", field: "code", flex: 2 },
      { headerName: "Type", field: "discount_type", width: 150 },
      {
        headerName: "Value",
        valueGetter: (params) =>
          params.data?.discount_type === "percent"
            ? `${params.data?.value}%`
            : `${params.data?.value} KWD`,
        width: 150,
      },
      {
        headerName: "Active",
        valueGetter: (params) => (params.data?.active ? "Yes" : "No"),
        width: 120,
      },
      {
        headerName: "Expiry",
        valueGetter: (params) =>
          params.data?.expiry_date
            ? new Date(params.data.expiry_date).toLocaleDateString()
            : "—",
        flex: 2,
      },
      {
        headerName: "Usage Limit",
        valueGetter: (params) => params.data?.usage_limit ?? "—",
        width: 150,
      },
    ],
    []
  );

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      {/* Search + Add */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button colorScheme="brandBlue" onClick={() => setIsAddModalOpen(true)}>
          Add
        </Button>
      </HStack>

      {/* Table */}
      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={discounts}
          columnDefs={columnDefs}
          setSelected={setSelectedDiscount}
          onDelete={handleDelete}
          type="discounts"
        />
      )}

      {/* Edit Modal */}
      {selectedDiscount && (
        <EditDiscountModal
          discount={selectedDiscount}
          isOpen={!!selectedDiscount}
          onClose={() => setSelectedDiscount(null)}
          onSubmit={handleSubmitDiscount}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <EditDiscountModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmitDiscount}
        />
      )}
    </Box>
  );
}