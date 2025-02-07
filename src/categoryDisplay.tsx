import { useState } from "react";

const CategoryDisplay = () => {
  const headings = ["field1", "field2", "field3", "field4"];
  const tableItems = [
    ["item1a", "item1b", "item1c", "item1d"],
    ["item2a", "", "item 2c", "item2d"],
    ["item3a", "item3b", "item3c", "item3d"],
  ];

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
