"use client";

import { useState, useMemo } from "react";
import { Box, Button, HStack, Input, Spinner, Text } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import {
  useAdminCategories,
  AdminCategory,
} from "@/hooks/use-admin-categories";
import MyTable from "@/components/admin/MyTable";
import EditCategoryModal from "@/components/admin/EditCategoryModal";

type ModalMode = "create" | "edit";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("edit");

  // Fetch categories & mutations
  const { categories, isLoading, deleteCategory } = useAdminCategories(search);

  // Delete
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  // Open for edit (row click)
  const handleRowSelect = (cat: AdminCategory | null) => {
    if (!cat) return;
    setSelectedCategory(cat);
    setMode("edit");
    setIsModalOpen(true);
  };

  // Open for create
  const handleAdd = () => {
    setSelectedCategory(null);
    setMode("create");
    setIsModalOpen(true);
  };

  // Columns
  const columnDefs: ColDef<AdminCategory>[] = useMemo(
    () => [
      {
        headerName: "#",
        width: 80,
        valueGetter: (params) =>
          typeof params.node?.rowIndex === "number"
            ? String(params.node.rowIndex + 1)
            : "-",
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

  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleAdd} colorScheme="brandBlue">
          Add
        </Button>
      </HStack>

      <Box
        bg="white"
        p={4}
        borderRadius="md"
        shadow="sm"
        minH="60vh"
        w="100%"
        mt={4}
      >
        {isLoading ? (
          <HStack justifyContent="center" alignItems="center" minH="30vh">
            <Spinner color="brandPink.500" size="xl" />
          </HStack>
        ) : (
          <MyTable
            rowData={categories}
            columnDefs={columnDefs}
            setSelected={handleRowSelect}
            onDelete={handleDelete}
            type="categories" // keep your prop if used internally
          />
        )}
      </Box>

      {isModalOpen && (
        <EditCategoryModal
          mode={mode}
          category={selectedCategory || undefined}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </Box>
  );
}
