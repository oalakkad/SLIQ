"use client";

import { useState, useMemo, useEffect } from "react";
import { Box, Input, HStack, Text, Button, useToast } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminAddons, AdminAddon } from "@/hooks/use-admin-addons";
import MyTable from "@/components/admin/MyTable";
import { EditAddonModal } from "@/components/admin/EditAddonModal";

export default function AddonsPage() {
  const [search, setSearch] = useState("");
  const [selectedAddon, setSelectedAddon] = useState<AdminAddon | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const toast = useToast();

  // 🔹 Fetch addons
  const { addons, isLoading, deleteAddon, createAddon, updateAddon } =
    useAdminAddons(search || undefined);

  // 🔹 Delete addon
  const handleDelete = (id: number) => {
    deleteAddon.mutate(id, {
      onSuccess: () =>
        toast({ title: "Addon deleted", status: "success", duration: 2000 }),
      onError: () =>
        toast({
          title: "Failed to delete addon",
          status: "error",
          duration: 2000,
        }),
    });
  };

  // 🔹 Submit addon (create or update)
  const handleSubmitAddon = (data: any) => {
    if (selectedAddon) {
      // Editing
      updateAddon.mutate(
        { id: selectedAddon.id, data },
        {
          onSuccess: () => {
            toast({
              title: "Addon updated",
              status: "success",
              duration: 2000,
            });
            setSelectedAddon(null);
          },
          onError: () =>
            toast({
              title: "Failed to update addon",
              status: "error",
              duration: 2000,
            }),
        }
      );
    } else {
      // Creating
      createAddon.mutate(data, {
        onSuccess: () => {
          toast({ title: "Addon created", status: "success", duration: 2000 });
          setIsAddModalOpen(false);
        },
        onError: () =>
          toast({
            title: "Failed to create addon",
            status: "error",
            duration: 2000,
          }),
      });
    }
  };

  // 🔹 Table columns
  const columnDefs: ColDef<AdminAddon>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      {
        headerName: "Addon Name",
        valueGetter: (params) =>
          params.data?.name_ar
            ? `${params.data.name} / ${params.data.name_ar}`
            : params.data?.name,
        flex: 2,
      },
      {
        headerName: "Categories",
        valueGetter: (params) =>
          Array.isArray(params.data?.categories) &&
          params.data.categories.length
            ? params.data.categories.join(", ")
            : "—",
        flex: 2,
      },
      {
        headerName: "Allow Multiple",
        valueGetter: (params) =>
          params.data?.allow_multiple_options ? "Yes" : "No",
        width: 150,
      },
    ],
    []
  );

  // 🔹 Loading state
  if (isLoading) {
    return <Box p={6}>Loading addons...</Box>;
  }

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      {/* Search + Add Button */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search addons"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button colorScheme="blue" onClick={() => setIsAddModalOpen(true)}>
          + Add Addon
        </Button>
      </HStack>

      {addons.length === 0 ? (
        <Text mt={10} textAlign="center" fontSize="lg" color="gray.500">
          No addons found
        </Text>
      ) : (
        <MyTable
          rowData={addons}
          columnDefs={columnDefs}
          setSelected={setSelectedAddon}
          onDelete={handleDelete}
        />
      )}

      {/* Edit Modal */}
      {selectedAddon && (
        <EditAddonModal
          addon={selectedAddon}
          isOpen={!!selectedAddon}
          onClose={() => setSelectedAddon(null)}
          onSubmit={handleSubmitAddon}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <EditAddonModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmitAddon}
        />
      )}
    </Box>
  );
}
