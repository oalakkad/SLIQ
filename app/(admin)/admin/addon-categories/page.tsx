"use client";

import { useState, useMemo } from "react";
import { Box, Input, HStack, Text, Button, Spinner } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import {
  useAdminAddonCategories,
  AdminAddonCategory,
} from "@/hooks/use-admin-addon-categories";
import MyTable from "@/components/admin/MyTable";
import EditAddonCategoryModal from "@/components/admin/EditAddonCategoryModal";

export default function AddonCategoriesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdminAddonCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 🔹 Fetch addon categories
  const { categories, isLoading, deleteAddonCategory } =
    useAdminAddonCategories(search);

  // 🔹 Table columns
  const columnDefs: ColDef<AdminAddonCategory>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      {
        headerName: "Category Name",
        valueGetter: (params) =>
          params.data?.name_ar
            ? `${params.data.name} / ${params.data.name_ar}`
            : params.data?.name,
        flex: 2,
      },
    ],
    []
  );

  // 🔹 Delete category
  const handleDelete = (id: number) => {
    deleteAddonCategory.mutate(id);
  };

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      {/* Search + Add Button */}
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          colorScheme={"brandPink"}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add
        </Button>
      </HStack>

      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={categories}
          columnDefs={columnDefs}
          setSelected={setSelectedCategory}
          onDelete={handleDelete}
          type="addon Categories"
        />
      )}

      {/* Edit Modal */}
      {selectedCategory && (
        <EditAddonCategoryModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <EditAddonCategoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </Box>
  );
}
