import { Box, Button, IconButton } from "@chakra-ui/react";
import { AgGridReact } from "ag-grid-react";
import root from "react-shadow";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

export default function MyTable({
  rowData,
  columnDefs,
  setSelected,
  onDelete,
  type,
}: {
  rowData: any[];
  columnDefs: any[];
  setSelected: (order: any) => void;
  onDelete: (id: number) => void;
  type?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const enhancedColumns = [
    ...columnDefs,
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      cellRenderer: (params: any) => {
        return (
          <IconButton
            aria-label="delete"
            icon={<FaTrash />}
            className="del-btn"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
              e.stopPropagation(); // prevent row select
              onDelete(params.data.id);
            }}
          >
            Delete
          </IconButton>
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
        <style>{`
          .del-btn {
            background: #fde4e6;
            border: none;
            color: white;
            padding: 0.5rem;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s all ease-in-out;
          }
          .del-btn:hover {
            background: #f8b9bc;
          }
        `}</style>
        <AgGridReact
          rowData={rowData}
          columnDefs={enhancedColumns}
          key={rowData.length} // ✅ Force re-render on data change
          pagination
          paginationPageSize={10}
          animateRows
          localeText={{
            noRowsToShow: `No ${
              type !== undefined
                ? type[0].toUpperCase() + type.slice(1, type.length)
                : "content"
            } found.`,
          }}
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
