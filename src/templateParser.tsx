class templateParser
{
    // Maybe need a function to extract the string[] from the template json file
        // Give the function a filename as an argument and return the stringified json as a string[]

    getTemplateName(template : String[]) : String
    {
        // Find the templateName entry inside the given string
            // Error if no template name found
        // Return its value

        return "";
    }

    getCategoryNames(template : String[]) : String[]
    {
        // Find the string section representing categories
            // Error if not such section found
        // Get an array ready to return
        // Loop through this section
            // Find each entry
            // Save as String[] temporarily
            // Find its name entry
            // Add to an array
        // Return the array

        return [""];
    }

    getFieldNames(template : String[], category : String) : String[]
    {
        // Find the string section representing categories
            // Error if not such section found
        // Loop through the categories section and find one with the name matching
            // Error if no matching
        // Find its fields section
            // Error if doesnt exist
        // Get an array ready to return
        // Loop through this section
            // Find each entry
            // Save as string[] temporarily
            // Find its name entry
            // Add to an array
        // Return the array
        
        return [""];
    }

    getFieldType(template : String[], category : String, field : String) : String
    {
        // Find the string section representing categories
            // Error if not such section found
        // Loop through the categories section and find one with the name matching
            // Error if no matching
        // Find the string section representing fields
            // Error if not such section found
        // Loop through this section
            // Find each entry
            // Check if matches field name
                // If so, find the type entry
                    // If doesn't exist give error
                // Store the type entry
        // Return the type
        
        return "";
    }   

    getCalulationNames(template : String[], category : String) : String[]
    {
        // Find the string section representing categories
            // Error if not such section found
        // Loop through the categories section and find one with the name matching
            // Error if no matching
        // Find its fields section
            // Error if doesnt exist
        // Get an array ready to return
        // Loop through this section
            // Find each entry
            // Save as string[] temporarily
            // Find its name entry
            // Add to an array
        // Return the array

        return [""];
    }

    getExpression(template : String[], category : String, calculation : String) : String
    {
        // Find the string section representing categories
            // Error if not such section found
        // Loop through the categories section and find one with the name matching
            // Error if no matching
        // Find the string section representing calculations
            // Error if not such section found
        // Loop through this section
            // Find each entry
            // Check if matches calulation name
                // If so, store the expression
            // If no matches to name, give error
        // Return the expression

        return "";
    }

    getVisible(template : String[], category : String, field : String) : boolean
    {
        // Find the string section representing categories
            // Error if not such section found
        // Loop through the categories section and find one with the name matching
            // Error if no matching
        // Find the string section representing fields
            // Error if not such section found
        // Loop through this section
            // Find each entry
            // Check if matches field name
                // If so, find the visible entry
                    // If doesn't exist give error
                // Store the visible entry
        // Return the boolean

        return false;
    }


}