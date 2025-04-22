import { useState } from "react";
import Creatable from "react-select/async-creatable";
import { getInstitutions, addInstitution, addUserInstitution } from "../database";
import { Button } from "@/components/ui/button";

// Account settings page, allows for institutions to be added to a users account
const SettingsPage = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [newInstitution, setNewInstitution] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (option: any) => {
    if (option) {
      // Set the selected institution
      setSelectedInstitution(option);
    } else {
      // If the user typed a custom institution, save it as a new institution
      setSelectedInstitution({ label: newInstitution, value: newInstitution });
    }
  };

  const handleInputChange = (inputValue: string) => {
    // Update input as user types
    setNewInstitution(inputValue); 
  };

  const handleAddInstitution = async () => {
    // Clear error message
    setErrorMessage("");

    // Display error if no institution selected
    if(!selectedInstitution){
      setErrorMessage("Please select or create an institution first.");
      return;
    }

    try {
      const institutionID = await addInstitution(selectedInstitution.value);

      // Add user institution pairing in database
      if (institutionID !== null) {
        await addUserInstitution(institutionID);
        setSuccessMessage("Institution added successfully!"); // Set success message
        setTimeout(() => {
          setSuccessMessage(null); // Clear message after 3 seconds
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding institution:", error);
      setErrorMessage("Error adding institution. Please try again.");
    }
  }

  return (
    <div className="px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {/* Add Institution Box */}
      <div className="max-w-2xl mx-auto p-6 border rounded-2xl shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Add Institution</h2>

        <label className="block text-sm font-medium mb-1">Institution Name:</label>
        <div className="mb-4">
          <Creatable
            cacheOptions
            loadOptions={getInstitutions} // Fetch options from DB
            defaultOptions
            onChange={handleChange}
            onInputChange={handleInputChange}
            value={selectedInstitution}
            inputValue={newInstitution}
            placeholder="Start typing an institution name..."
            isClearable
            classNamePrefix="react-select"
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {successMessage && (
          <div className="mt-4 text-green-600 font-semibold">{successMessage}</div>
        )}

        <Button variant="outline" onClick={handleAddInstitution}>
          Add Institution
        </Button>
        
      </div>
    </div>
  );
};

export default SettingsPage;
