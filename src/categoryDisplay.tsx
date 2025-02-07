/**
 * takes a 2D array of all data for a respective category within a project,
 * then displays said data into basic HTML table
 * CURRENTLY ASSUMES EVERY ITEM IS A STRING
 */
const CategoryDisplay: React.FC<{ data: string[][] }> = ({ data }) => {
  /**
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
