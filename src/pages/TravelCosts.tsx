import React, { useState } from "react";

const TravelCosts: React.FC = () => {
  const [travels, setTravels] = useState<{ 
    destination: string; 
    purpose: string;
    flights: number; 
    accommodation: number; 
    food: number; 
    transport: number; 
    total: number; 
  }[]>([]);

  const [newDestination, setNewDestination] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [newFlights, setNewFlights] = useState("");
  const [newAccommodation, setNewAccommodation] = useState("");
  const [newFood, setNewFood] = useState("");
  const [newTransport, setNewTransport] = useState("");
  const [totalTravelCost, setTotalTravelCost] = useState(0);

  const handleAddTravel = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDestination || !newPurpose || !newFlights || !newAccommodation || !newFood || !newTransport) {
      alert("Please fill in all fields!");
      return;
    }

    const flights = parseFloat(newFlights);
    const accommodation = parseFloat(newAccommodation);
    const food = parseFloat(newFood);
    const transport = parseFloat(newTransport);

    if (isNaN(flights) || isNaN(accommodation) || isNaN(food) || isNaN(transport) || flights < 0 || accommodation < 0 || food < 0 || transport < 0) {
      alert("Please enter valid numerical values for costs.");
      return;
    }

    const total = flights + accommodation + food + transport;

    const newEntry = { 
      destination: newDestination, 
      purpose: newPurpose,
      flights, 
      accommodation, 
      food, 
      transport, 
      total 
    };

    setTravels([...travels, newEntry]);
    setTotalTravelCost(totalTravelCost + total);

    // Reset input fields
    setNewDestination("");
    setNewPurpose("");
    setNewFlights("");
    setNewAccommodation("");
    setNewFood("");
    setNewTransport("");
  };

  return (
    <div>
      <h2>Travel Costs</h2>

      {/* Form Section */}
      <form onSubmit={handleAddTravel} style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        
        <label>Destination:</label>
        <input type="text" value={newDestination} onChange={(e) => setNewDestination(e.target.value)} required />

        <label>Purpose of Travel:</label>
        <textarea value={newPurpose} onChange={(e) => setNewPurpose(e.target.value)} required />

        <label>Flights (£):</label>
        <input type="number" value={newFlights} onChange={(e) => setNewFlights(e.target.value)} required />

        <label>Accommodation (£):</label>
        <input type="number" value={newAccommodation} onChange={(e) => setNewAccommodation(e.target.value)} required />

        <label>Food (£):</label>
        <input type="number" value={newFood} onChange={(e) => setNewFood(e.target.value)} required />

        <label>Local Transport (£):</label>
        <input type="number" value={newTransport} onChange={(e) => setNewTransport(e.target.value)} required />

        <button type="submit" style={{ marginTop: "10px" }}>Add Travel Cost</button>
      </form>

      {/* Total Cost Section */}
      <h3>Total Travel Costs: £{totalTravelCost.toFixed(2)}</h3>

      {/* List of Added Travel Expenses */}
      <ul style={{ maxWidth: "500px", listStyle: "none", padding: 0 }}>
        {travels.map((trip, index) => (
          <li key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
            <strong> {trip.destination}</strong>  
            <br />
            <span> <strong>Flights:</strong> £{trip.flights.toFixed(2)}</span>  
            <br />
            <span> <strong>Accommodation:</strong> £{trip.accommodation.toFixed(2)}</span>  
            <br />
            <span> <strong>Food:</strong> £{trip.food.toFixed(2)}</span>  
            <br />
            <span> <strong>Transport:</strong> £{trip.transport.toFixed(2)}</span>  
            <br />
            <span> <strong>Total Cost:</strong> £{trip.total.toFixed(2)}</span>  
            <br />
            <em> Purpose:</em> {trip.purpose}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TravelCosts;
