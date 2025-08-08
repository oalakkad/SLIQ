"use client";

import { useState, useMemo } from "react";
import { Box } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import {
  useAdminCategories,
  AdminCategory,
} from "@/hooks/use-admin-categories";
import SearchFilters from "@/components/admin/SearchFilters";
import MyTable from "@/components/admin/MyTable";
import EditCategoryModal from "@/components/admin/EditCategoryModal";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);

  // 🔹 Fetch categories & mutations
  const { categories, isLoading, deleteCategory } = useAdminCategories(search);

  // 🔹 Handle delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  // 🔹 Define columns
  const columnDefs: ColDef<AdminCategory>[] = useMemo(
    () => [
      {
        headerName: "#",
        width: 80,
        valueGetter: (params) => {
          if (!params.node?.rowIndex) return "-";
          return (params.node.rowIndex + 1).toString();
        },
      },
      { headerName: "Category Name", field: "name", flex: 2 },
      { headerName: "Name (Arabic)", field: "name_ar", flex: 2 },
      { headerName: "Slug", field: "slug", flex: 2 },
      {
        headerName: "Parent ID",
        flex: 1,
        valueGetter: (params) => params.data?.parent ?? "—",
      },
      {
        headerName: "Created At",
        flex: 2,
        valueGetter: (params) =>
          params.data?.created_at
            ? new Date(params.data.created_at).toLocaleString()
            : "—",
      },
    ],
    []
  );

  // 🔹 Loading State
  if (isLoading) {
    return <Box p={6}>Loading categories...</Box>;
  }

  return (
    <>
      {/* 🔹 AG Grid Table */}
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        shadow="sm"
        minH="100vh"
        w="100%"
        mt={4}
      >
        <MyTable
          rowData={categories}
          columnDefs={columnDefs}
          setSelected={setSelectedCategory}
          onDelete={handleDelete}
        />
      </Box>

      {/* 🔹 Edit Modal */}
      {selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          isOpen={!!selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </>
  );
}
