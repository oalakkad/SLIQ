import { Box, Button } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import root from "react-shadow";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

export default function MyTable({
  rowData,
  columnDefs,
  setSelected,
  onDelete,
}: {
  rowData: any[];
  columnDefs: any[];
  setSelected: (order: any) => void;
  onDelete: (id: number) => void;
}) {
  const enhancedColumns = [
    ...columnDefs,
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <Button
            size="sm"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation(); // prevent row select
              onDelete(params.data.id);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];
  return (
    <Box w="100%" h="600px" overflow={"scroll"}>
      <root.div
        className="ag-theme-quartz"
        style={{ width: "100%", height: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={enhancedColumns}
          key={rowData.length} // ✅ Force re-render on data change
          pagination
          paginationPageSize={10}
          animateRows
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
          }}
          onCellClicked={(params) => {
            // Only open modal if NOT clicking the actions column
            if (params.colDef.field !== "actions") {
              setSelected(params.data || null);
            }
          }}
        />
      </root.div>
    </Box>
  );
}
