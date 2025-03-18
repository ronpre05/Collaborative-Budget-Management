import { useState } from "react";
import Creatable from "react-select/async-creatable";
import { getInstitutions, addInstitution, addUserInstitution } from "../database";
import { Button } from "@/components/ui/button";

// Account settings page, allows for institutions to be added to a users account
const SettingsPage = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [newInstitution, setNewInstitution] = useState<string>("");

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
    console.log(selectedInstitution.value);
    const institutionID = await addInstitution(selectedInstitution.value);

    // Add user institution pairing in database
    if(institutionID !== null){
      await addUserInstitution(institutionID);
    }
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
        value={selectedInstitution}
        inputValue={newInstitution}
        placeholder="Start typing an institution name..."
        isClearable
      />

      <Button variant="outline" onClick={handleAddInstitution} >Add Institution</Button>
    </div>
  );
};

export default SettingsPage;
