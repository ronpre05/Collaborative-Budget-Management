/**
 * takes a 2D array of all data for a respective category within a project,
 * displays data
 */
const CategoryDisplay: React.FC<{ data: string[][] }> = ({ data }) => {
  /**
   * slices data into 2 arrays,
   * "headings" array, for category fields - 1D
   * "tableItems" array, everything else - 2D
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
