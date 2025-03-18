import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type React from "react"



/**
 * Dynamic table display for a 2D array using shadcn/ui components.
 * @component
 *
 * @param props Component props.
 * @param {Array<Array<string>>} props.data 2D array of data.
 * @returns {JSX.Element} Table displaying the provided data.
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
  // Check if data is valid and iterable
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

  // Extract headers and table data
  const headings = data[0] || []
  const tableItems = data.slice(1)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headings.map((header, index) => (
              <TableHead key={index}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableItems.length > 0 ? (
            tableItems.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.isArray(row) ? (
                  row.map((item, cellIndex) => <TableCell key={cellIndex}>{item}</TableCell>)
                ) : (
                  <TableCell>Invalid row data</TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headings.length || 1} className="h-24 text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CategoryDisplay

