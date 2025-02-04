import { useState } from "react";

const DynamicDisplay = () => {
  const [sampleData, setSampleData] = useState<string[][]>([
    ["Field1", "Field2", "Field8"],
    ["Field3", "Field4"],
    ["Field5", "Field6", "Field7"],
  ]);

  return (
    <div>
      <h2>dynamic table display</h2>
      {sampleData.map((category, index) => (
        <div key={index}>
          <h3>Category {index + 1}</h3>
          <ul>
            {category.map((field, fieldIndex) => (
              <li key={fieldIndex}>{field}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default DynamicDisplay;
