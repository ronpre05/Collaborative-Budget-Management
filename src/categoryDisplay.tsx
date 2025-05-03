"use client"
import type React from "react"
import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { type ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Button } from "./components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

/**
 * Dynamic data table display for a 2D array using shadcn/ui and Tanstack Table.
 * @component
 *
 * @param props Component props.
 * @param {Array<Array<string>>} props.data 2D array of data.
 * @returns {JSX.Element} DataTable displaying the provided data.
 *
 * @example
 * const tableData = [
 * ['Name', 'Age', 'Occupation'],
 * ['Alice', '25', 'Engineer'],
 * ['Bob', '30', 'Designer']
 * ];
 *
 * return <CategoryDisplay data={tableData} />;
 */
const CategoryDisplay: React.FC<{ data: string[][] | null | undefined }> = ({ data }): JSX.Element => {
  // Handle invalid data
  const headers = useMemo(() => (data && data.length > 0 ? data[0] || [] : []), [data])
  const tableItems = useMemo(() => (data && data.length > 1 ? data.slice(1) : []), [data])

  const columns = useMemo<ColumnDef<Record<string, string>>[]>(() => {
    return headers.map((header, index) => ({
      accessorKey: header.toString() || `column${index}`,
      header: () => <div>{header}</div>,
      cell: ({ row }) => <div>{row.getValue(header.toString() || `column${index}`)}</div>,
    }))
  }, [headers])

  // Transform data into an array of objects
  const tableData = useMemo(() => {
    return tableItems.map((row) => {
      const rowData: Record<string, string> = {}
      headers.forEach((header, index) => {

        let value = row[index];

        // Check value is a string
        const strValue = String(value);
  
        // Check if its a number and has decimals
        const num = parseFloat(strValue);
        const isNumeric = !isNaN(num);
  
        // Round for decimals to 2dp
        if (isNumeric && !Number.isInteger(num)) {
          rowData[header.toString() || `column${index}`] = num.toFixed(2);
        } 
        // Display normal value if not a number
        else {
          rowData[header.toString() || `column${index}`] = strValue;
        }
      })
      return rowData
    })
  }, [headers, tableItems])

  // Create table instance with pagination
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="h-24 text-center">No data available.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="m-3 space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls (pages) */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} - {" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            tableData.length,
          )}{" "}
          of {tableData.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CategoryDisplay
