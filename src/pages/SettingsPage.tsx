import { useState } from "react";
import Creatable from "react-select/async-creatable";
import { getInstitutions, addInstitution } from "../database";

const SettingsPage = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [newInstitution, setNewInstitution] = useState<string>("");

  const handleChange = (option: any) => {
    if (option) {
      setSelectedInstitution(option); // Set the selected institution if any
    } else {
      // If the user typed a custom institution, save it as a new institution
      setSelectedInstitution({ label: newInstitution, value: newInstitution });
    }
  };

  const handleInputChange = (inputValue: string) => {
    setNewInstitution(inputValue); // Update input as user types
  };

  const handleAddInstitution = () => {
    console.log(selectedInstitution.value);
    addInstitution(selectedInstitution.value);
  }

  return (
    <div>
      <label>Institution Name: </label>
      <Creatable
        cacheOptions
        loadOptions={getInstitutions} // Fetch options from DB
        defaultOptions
        onChange={handleChange}
        onInputChange={handleInputChange}
        value={selectedInstitution} // Sync the selected institution
        inputValue={newInstitution} // Sync the input field value
        placeholder="Start typing an institution name..."
        isClearable
      />

      {selectedInstitution ? (
        <p>Selected Institution: {selectedInstitution.label}</p>
      ) : (
        <p>Custom Institution: {newInstitution}</p>  // Show the custom typed value
      )}

      <button type="button" onClick={handleAddInstitution}>Add Institution</button>
    </div>
  );
};

export default SettingsPage;
