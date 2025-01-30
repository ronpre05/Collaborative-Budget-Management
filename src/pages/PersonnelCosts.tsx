import React, { useState } from "react";

const PersonnelCosts: React.FC = () => {
  const [personnel, setPersonnel] = useState<{ 
    name: string; 
    role: string; 
    salary: number; 
    startDate: string; 
    endDate: string; 
    percentage: number; 
    personMonths: number; 
    totalCost: number; 
    justification: string; 
  }[]>([]);

  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [newJustification, setNewJustification] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const calculatePersonMonths = (start: string, end: string, percentage: number) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate >= endDate) {
      return 0; // Invalid dates
    }

    // Gets full months between start and end date
    const monthsWorked = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                         (endDate.getMonth() - startDate.getMonth());

    // Multiplies by the percentage worked
    return monthsWorked * (percentage / 100);
  };

  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newRole || !newSalary || !newStartDate || !newEndDate || !newPercentage || !newJustification) {
      alert("Please fill in all fields!");
      return;
    }

    const salary = parseFloat(newSalary);
    const percentage = parseFloat(newPercentage);
    const personMonths = calculatePersonMonths(newStartDate, newEndDate, percentage);
    const total = salary * personMonths;

    if (personMonths <= 0) {
      alert("Invalid person months calculation. Please check the dates and percentage.");
      return;
    }

    const newEntry = { 
      name: newName, 
      role: newRole, 
      salary, 
      startDate: newStartDate, 
      endDate: newEndDate, 
      percentage, 
      personMonths, 
      totalCost: total, 
      justification: newJustification 
    };

    setPersonnel([...personnel, newEntry]);
    setTotalCost(totalCost + total);

    // Reset input fields
    setNewName("");
    setNewRole("");
    setNewSalary("");
    setNewStartDate("");
    setNewEndDate("");
    setNewPercentage("");
    setNewJustification("");
  };

  return (
    <div>
      <h2>Personnel Costs</h2>

      {/* Form Section */}
      <form onSubmit={handleAddPersonnel} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        
        <label>Employee Name:</label>
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required />
        
        <label>Role:</label>
        <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} required />

        <label>Monthly Salary (£):</label>
        <input type="number" value={newSalary} onChange={(e) => setNewSalary(e.target.value)} required />

        <label>Start Date:</label>
        <input type="date" value={newStartDate} onChange={(e) => setNewStartDate(e.target.value)} required />

        <label>End Date:</label>
        <input type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} required />

        <label>Percentage of Time Worked:</label>
        <input 
          type="number" 
          value={newPercentage} 
          onChange={(e) => setNewPercentage(e.target.value)} 
          placeholder="100 for full-time, 50 for half-time" 
          required 
        />

        <label>Justification:</label>
        <textarea value={newJustification} onChange={(e) => setNewJustification(e.target.value)} required />

        <button type="submit" style={{ marginTop: "10px" }}>Add Personnel</button>
      </form>

      {/* Total Cost Section */}
      <h3>Total Personnel Costs: £{totalCost.toFixed(2)}</h3>

      {/* List of Added Personnel */}
      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {personnel.map((person, index) => (
          <li key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
            <strong>{person.name} ({person.role})</strong>  
            <br />
            <span> <strong>Salary:</strong> £{person.salary.toFixed(2)}</span>  
            <br />
            <span> <strong>Duration:</strong> {person.startDate} → {person.endDate}</span>  
            <br />
            <span> <strong>Percentage Worked:</strong> {person.percentage}%</span>  
            <br />
            <span> <strong>Person Months:</strong> {person.personMonths.toFixed(2)}</span>  
            <br />
            <span> <strong>Total Cost:</strong> £{person.totalCost.toFixed(2)}</span>  
            <br />
            <em> Justification:</em> {person.justification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonnelCosts;
