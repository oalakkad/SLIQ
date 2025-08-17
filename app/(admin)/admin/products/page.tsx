"use client";

import { useState, useMemo, useEffect } from "react";
import { Box, Input, HStack, Text, Spinner, Button } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminProducts, AdminProduct } from "@/hooks/use-admin-products";
import MyTable from "@/components/admin/MyTable";
import EditProductModal from "@/components/admin/EditProductModal";

type ModalMode = "create" | "edit";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("edit");

  // Fetch products (no pagination)
  const { products, isLoading, deleteProduct } = useAdminProducts(search);

  // Keep products in local state for table
  const [rows, setRows] = useState<AdminProduct[]>([]);
  useEffect(() => {
    setRows(products || []);
  }, [products]);

  // Delete product
  const handleDelete = (id: number) => {
    deleteProduct.mutate(id);
  };

  // Open edit modal (row click)
  const handleRowSelect = (prod: AdminProduct | null) => {
    if (!prod) return;
    setSelectedProduct(prod);
    setMode("edit");
    setIsModalOpen(true);
  };

  // Add new product
  const handleAdd = () => {
    setSelectedProduct(null);
    setMode("create");
    setIsModalOpen(true);
  };

  // Columns
  const columnDefs: ColDef<AdminProduct>[] = useMemo(
    () => [
      { headerName: "ID", field: "id", width: 80 },
      {
        headerName: "Product Name",
        valueGetter: (params) =>
          params.data?.name_ar
            ? `${params.data.name} / ${params.data.name_ar}`
            : params.data?.name,
        flex: 2,
      },
      {
        headerName: "Price",
        field: "price",
        width: 100,
        valueFormatter: (params) => `${Number(params.value).toFixed(3)} KWD`,
      },
      {
        headerName: "Categories",
        valueGetter: (params) =>
          params.data?.categories?.map((c) => c.name).join(", ") || "—",
        flex: 2,
      },
      {
        headerName: "New",
        valueGetter: (params) => (params.data?.is_new_arrival ? "Yes" : "No"),
        width: 100,
      },
      {
        headerName: "Created At",
        valueGetter: (params) => {
          const date = params.data?.created_at;
          return date ? new Date(date).toLocaleString() : "—";
        },
        flex: 2,
      },
      {
        headerName: "Updated At",
        valueGetter: (params) => {
          const date = params.data?.updated_at;
          return date ? new Date(date).toLocaleString() : "—";
        },
        flex: 2,
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
        <Button onClick={handleAdd}>Add</Button>
      </HStack>

      {isLoading ? (
        <HStack justifyContent="center" alignItems="center" minH="30vh">
          <Spinner color="brandPink.500" size="xl" />
        </HStack>
      ) : (
        <MyTable
          rowData={rows}
          columnDefs={columnDefs}
          setSelected={handleRowSelect}
          onDelete={handleDelete}
          type="products"
        />
      )}

      {isModalOpen && (
        <EditProductModal
          mode={mode}
          product={selectedProduct || undefined}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </Box>
  );
}
