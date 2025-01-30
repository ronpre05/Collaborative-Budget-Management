import React, { useState } from "react";

const EquipmentCosts: React.FC = () => {
  const [equipment, setEquipment] = useState<{ 
    name: string; 
    category: string;
    unitCost: number; 
    quantity: number; 
    total: number; 
    justification: string; 
  }[]>([]);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Hardware");
  const [newUnitCost, setNewUnitCost] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newJustification, setNewJustification] = useState("");
  const [totalEquipmentCost, setTotalEquipmentCost] = useState(0);

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newUnitCost || !newQuantity || !newJustification) {
      alert("Please fill in all fields!");
      return;
    }

    const unitCost = parseFloat(newUnitCost);
    const quantity = parseInt(newQuantity);

    if (isNaN(unitCost) || isNaN(quantity) || quantity <= 0 || unitCost < 0) {
      alert("Please enter valid numerical values for unit cost and quantity.");
      return;
    }

    const total = unitCost * quantity;

    const newEntry = { 
      name: newName, 
      category: newCategory,
      unitCost, 
      quantity, 
      total, 
      justification: newJustification 
    };

    setEquipment([...equipment, newEntry]);
    setTotalEquipmentCost(totalEquipmentCost + total);

    // Reset input fields
    setNewName("");
    setNewCategory("Hardware");
    setNewUnitCost("");
    setNewQuantity("");
    setNewJustification("");
};


  return (
    <div>
      <h2>Equipment Costs</h2>

      {/* Form Section */}
      <form onSubmit={handleAddEquipment} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        
        <label>Equipment Name:</label>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required />

        <label>Category:</label>
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          <option value="Hardware">Hardware</option>
          <option value="Software">Software</option>
          <option value="Lab Equipment">Lab Equipment</option>
          <option value="Office Equipment">Office Equipment</option>
          <option value="Other">Other</option>
        </select>

        <label>Unit Cost (£):</label>
        <input type="number" value={newUnitCost} onChange={(e) => setNewUnitCost(e.target.value)} required />

        <label>Quantity:</label>
        <input type="number" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} required />

        <label>Justification:</label>
        <textarea value={newJustification} onChange={(e) => setNewJustification(e.target.value)} required />

        <button type="submit" style={{ marginTop: "10px" }}>Add Equipment</button>
      </form>

      {/* Total Cost Section */}
      <h3>Total Equipment Costs: £{totalEquipmentCost.toFixed(2)}</h3>

      {/* List of Added Equipment */}
      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {equipment.map((item, index) => (
          <li key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
            <strong> {item.name} ({item.category})</strong>  
            <br />
            <span> <strong>Unit Cost:</strong> £{item.unitCost.toFixed(2)}</span>  
            <br />
            <span> <strong>Quantity:</strong> {item.quantity}</span>  
            <br />
            <span> <strong>Total Cost:</strong> £{item.total.toFixed(2)}</span>  
            <br />
            <em> Justification:</em> {item.justification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentCosts;
