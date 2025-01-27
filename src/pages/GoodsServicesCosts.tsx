import React, { useState } from "react";

const GoodsServicesCosts: React.FC = () => {
  const [goodsServices, setGoodsServices] = useState<{ cost: number; justification: string }[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [newCost, setNewCost] = useState("");
  const [newJustification, setNewJustification] = useState("");

  const handleAddCost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCost || !newJustification) {
      alert("Please provide both cost and justification!");
      return;
    }

    const cost = parseFloat(newCost);
    const justification = newJustification;

    setGoodsServices((prev) => [...prev, { cost, justification }]);
    setTotalCost((prev) => prev + cost);

    setNewCost("");
    setNewJustification("");
  };

  return (
    <div>
      <h2>Goods and Services Costs</h2>
      <form onSubmit={handleAddCost}>
        <label>
          Cost:
          <input
            type="number"
            step="0.01"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            placeholder="Enter cost"
            required
          />
        </label>
        <label>
          Justification:
          <input
            type="text"
            value={newJustification}
            onChange={(e) => setNewJustification(e.target.value)}
            placeholder="Enter justification"
            required
          />
        </label>
        <button type="submit">Add Cost</button>
      </form>

      <h3>Total Goods/Services Costs: ${totalCost.toFixed(2)}</h3>
      <ul>
        {goodsServices.map((item, index) => (
          <li key={index}>
            <strong>Cost:</strong> ${item.cost.toFixed(2)}, <strong>Justification:</strong> {item.justification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoodsServicesCosts;
