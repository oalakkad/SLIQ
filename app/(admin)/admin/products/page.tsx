"use client";

import { useState, useMemo, useEffect } from "react";
import { Box, Input, HStack, Text } from "@chakra-ui/react";
import type { ColDef } from "ag-grid-community";
import { ModuleRegistry } from "ag-grid-community";
import { AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import { useAdminProducts, AdminProduct } from "@/hooks/use-admin-products";
import MyTable from "@/components/admin/MyTable";
import EditProductModal from "@/components/admin/EditProductModal";
import SearchFilters from "@/components/admin/SearchFilters";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null
  );

  // 🔹 Fetch products
  const { products, isLoading, deleteProduct } = useAdminProducts(
    search || undefined
  );

  // 🔹 Keep products in local state for table
  const [rows, setRows] = useState<AdminProduct[]>([]);
  useEffect(() => {
    setRows(products || []);
  }, [products]);

  // 🔹 Delete product
  const handleDelete = (id: number) => {
    deleteProduct.mutate(id);
  };

  // 🔹 Define columns
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

  // 🔹 Loading state
  if (isLoading) {
    return <Box p={6}>Loading products...</Box>;
  }

  // 🔹 No data fallback
  if (!rows || rows.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="md" shadow="sm" minH="100vh" w="100%">
        <HStack mb={4} spacing={4}>
          <Input
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </HStack>
        <Text mt={10} textAlign="center" fontSize="lg" color="gray.500">
          No products found
        </Text>
      </Box>
    );
  }

  // 🔹 Table
  return (
    <Box bg="white" p={4} borderRadius="md" shadow="sm" minH="100vh" w="100%">
      <SearchFilters onSearch={(val) => setSearch(val)} />

      <MyTable
        rowData={rows}
        columnDefs={columnDefs}
        setSelected={setSelectedProduct} // ✅ FIXED
        onDelete={handleDelete}
      />

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </Box>
  );
}
