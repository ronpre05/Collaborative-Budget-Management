# [Return Home](../software_manual.md)

# Table of Contents

- [Data Display](#data-display)
  - [Data Retrieval](#data-retrieval)
  - [Data Formatting](#data-formatting)
  - [Table Display](#table-display)

# Data Display

Data display works in three parts:

1. Retrieve the data from the database
2. Format the data
3. Display the data

## Data Retrieval

Data retrieval works via a chain of fetch requests to the database, starting from the Category ID for the category we are fetching data for and ending with a 2D array of (unordered) data.
These functions are all combined into one master function within the `"queryFunctions.tsx"` file, located at the bottom.

```
export async function getCategoryDataCatOnly(categoryID: number): Promise<string[][]> {
  const fieldIDs = await getFieldIDs(categoryID);
  const catHeaders = await getCategoryHeaders(categoryID);
  const fieldData = await getFieldData(fieldIDs);

  // Check if fieldData is empty or its first element is undefined.
  if (!fieldData || fieldData.length === 0 || !fieldData[0]) {
    return [catHeaders]; // Return only the headers if there's no data.
  }

  const result = formatData(catHeaders, fieldData);
  return result;
}
```

The overall process is the following:

1. Using the Category ID, query the database to find every Field ID linked to said Category.
2. Query the database to get the heading/title of every Field, and store in a separate array called `catHeaders`.
3. Then query every Field ID, creating a 2D array that stores the results of each query in separate arrays. Store within `fieldData`.
4. If `fieldData` is empty, meaning there is no data added to this category yet, only return the headings of each category (`catHeaders`).
5. Otherwise, format and combine all data (as it is currently unordered), and return the result.

All of these steps typically make use of an asynchronous function that queries the database, and handles the data in some way. See the following:

```
async function getCategoryHeaders(categoryID: number): Promise<string[]> {
  const { data, error } = await supabase
    .from("CategoryFields")
    .select("fieldName")
    .eq("categoryID", categoryID);
  if (error) {
    console.error("Unable to fetch headings for CategoryID:", categoryID);
    return [];
  }

  return data.map((item) => cleanString(item.fieldName));
}
```

Here is the function for fetching all the category headers. You can clearly see that it first queries the database, as well as checking for errors, before mapping the results to an array. This is the typical format all of these functions follow, with all functions within the `"queryFunctions.tsx"` file formatted with JSDoc:

```
/**
 * Fetches all FieldNames for the Field of a given Category.
 * @param {number} categoryID ID of category to fetch FieldNames for.
 * @returns {Promise<string[]>} A promise that resolves to an array of FieldNames.
 *
 * @example
 * const categoryHeaders = await getCategoryHeaders(categoryID);
 */
```

This is the JSDoc for the above function.

## Data Formatting

When retrieving data for each field, the code will fetch the data for one field at a time. This is great for ease of use and speed, but leaves the overall data unordered. Take the following example:

```
[
	["name1", "name2", "name3", "name4", "name5", "name6"],
	[age1, age2, age3, age4, age5, age6],
	[gender1, gender2, gender3, gender4, gender5, gender6],
	[salary1, salary2, salary3, salary4, salary5, salary6]
]
```

In the above example, the fieldData we truly want is top-down. That is, we want `["name1", age1, gender1, salary1]` to be the first array, not all the names, then all the ages, genders, and so on.

To do this, we use the `formatData` function:

```
function formatData(
  categoryHeaders: string[],
  fieldData: string[][]
): string[][] {
  const transposed = fieldData[0].map((_, colIndex) =>
    fieldData.map((row) => row[colIndex])
  );
  transposed.unshift(categoryHeaders);

  return transposed;
}
```

This function does 2 things:

1. Flip the rows and columns of `fieldData`, storing the result in a new 2D array called `transposed`.
2. Push the `catHeaders` array to the front of `transposed`

In the example previously mentioned, with a `catHeaders` of `["Name", "Age", "Gender", "Salary"]`, we would end up with the following:

```
[
	["Name", "Age", "Gender", "Salary"],
	["name1", age1, gender1, salary1],
	["name2", age2, gender2, salary2],
	["name3", age3, gender3, salary3],
	["name4", age4, gender4, salary4],
	["name5", age5, gender5, salary5],
	["name6", age6, gender6, salary6]
]
```

You can see now that the data is ordered, and already is beginning to look like a table. All that is left is to display it to the user.

## Table Display

The final step now is to display the data back to the user, in a way that can account for any size of 2D array. This is handled within a modular component, that can be used where required. This component is contained within the `"categoryDisplay.tsx"` file, which is documented with JSDoc.

The main section, `lines 26-61`, handles the logic for this:

```
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
        rowData[header.toString() || `column${index}`] = row[index] || ""
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
```

First, the 2D array is sliced along the first item, separating the array of headings, `catHeaders`, and the 2D array of data, `fieldData`.

Then, the data is memoized, using the `useMemo` react hook, to store `catHeaders` into `columns`, and `fieldData` into `tableItems`. Each individual row is stored within a `rowData` object, which combined together make up `tableData`, which is the overall data for the table.

This is then used to create a table instance, using pagination, with `tableData` as our base. The rest of the `"categoryDisplay.tsx"` file is formatting, using `shadcn` components for design.
