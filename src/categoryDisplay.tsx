/**
 * Dynamic table display for a 2D array.
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
const CategoryDisplay: React.FC<{ data: string[][] }> = ({
  data,
}): JSX.Element => {
  /*
   * slices data into 2 arrays,
   * "headings" array, for category fields - 1D array
   * "tableItems" array, contents of every field - 2D array
   */
  const [headings, ...tableItems] = data;

  return (
    <div className="dymcTable">
      <h2>dynamic table display</h2>
      <table>
        <thead>
          <tr>
            {headings.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableItems.map((row, index) => (
            <tr key={index}>
              {row.map((item, itemIndex) => (
                <td key={itemIndex}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default CategoryDisplay;
