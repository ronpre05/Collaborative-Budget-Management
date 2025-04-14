import template from "../template1.json"
import { TemplateData } from "../src/types"
import { expect, test } from 'vitest'
import { getTemplate } from "../src/newTemplateParser"

/*
Tests will be ran against the base "Horizon RIA" template inside
"../template1.json"

If getTemplate operates correctly, then so do sub functions
    - getCategoriesFromRaw()
    - getCategoryData()
    - getFieldsFromRaw()
    - getSubEntryFromRaw()
    - getCalculationsFromRaw()
    - getFieldData()
    - getCalcData()

The expected TemplateData structure to be returned from
getTemplate() is below, to be used to test getTemplate()
and other operations on the given types
*/


const truthTemplate : TemplateData = 
{
    templateName : "Horizon RIA",
    categories : 
    [
        {
            name : "Personnel",
            hassubentry : false,
            fields : 
            [
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Start_Date",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "End_Date",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Percentage",
                    prefix : "",
                    value : "",
                    postfix : "%",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Person_Month",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Local_Total",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Person_Months",
                    expression : "(Personnel:End_Date - Personnel:Start_Date) * Personnel:Percentage",
                    type : "Local",
                    output : "Person_Month"
                },
                {
                    name : "Entry_Total",
                    expression : "Personnel:Amount",
                    type : "Local",
                    output : "Local_Total"
                }
            ],
            subentries : []
        }, 
        {
            name : "Equipment",
            hassubentry : false,
            fields : 
            [   
                {
                    name : "What",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Local_Total",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Entry_Total",
                    expression : "Equipment:Amount",
                    type : "Local",
                    output : "Local_Total"
                }
            ],
            subentries : []
        }, 
        {
            name : "Other_Goods_and_Services",
            hassubentry : false,
            fields : 
            [
                {
                    name : "What",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Local_Total",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Entry_Total",
                    expression : "Other_Goods_and_Services:Amount",
                    type : "Local",
                    output : "Local_Total"
                }
            ],
            subentries : []
        }, 
        {
            name : "Travel_Costs",
            hassubentry : true,
            fields : 
            [
                {
                    name : "Days",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Accomodation",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Sustinance",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Base_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Entry_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Trip_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Base_Total",
                    expression : "Travel_Costs:Days*Travel_Costs:Accomodation + Travel_Costs:Days*Travel_Costs:Sustinance",
                    type : "Local",
                    output : "Base_Total"
                },
                {
                    name : "Entry_Total",
                    expression : "Travel_Costs:Amount",
                    type : "SubGlobal",
                    output : "Entry_Total"
                },
                {
                    name : "Trip_Total",
                    expression : "Travel_Costs:Base_Total + Travel_Costs:Entry_Total",
                    type : "Local",
                    output : "Trip_Total"
                }
            ],
            subentries : 
            [
                {
                    name : "What",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                }
            ]
        }, 
        {
            name : "Subcontracting",
            hassubentry : false,
            fields : 
            [
                {
                    name : "What",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Local_Total",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Entry_Total",
                    expression : "Subcontracting:Amount",
                    type : "Local",
                    output : "Local_Total"
                }
            ],
            subentries : []
        }, 
        {
            name : "Internally_Invoiced_Services",
            hassubentry : false,
            fields : 
            [
                {
                    name : "What",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Local_Total",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Entry_Total",
                    expression : "Internally_Invoiced_Services:Amount",
                    type : "Local",
                    output : "Local_Total"
                }
            ],
            subentries : []
        }, 
        {
            name : "Totals",
            hassubentry : false,
            fields : 
            [
                {
                    name : "Indirect_Costs",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Personnel_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Equipment_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Other_Goods_and_Services_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Subcontracting_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Internally_Invoiced_Services_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Travel_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                },
                {
                    name : "Grand_Total",
                    prefix : "€",
                    value : "",
                    postfix : "",
                    type : "Float",
                    displayvisible : true,
                    entryvisible : false
                }
            ],
            calculations : 
            [
                {
                    name : "Indirect_Cost",
                    expression : "0.25 * (Totals:Personnel_Total + Totals:Equipment_Total + Totals:Other_Goods_and_Services_Total + Totals:Travel_Total)",
                    type : "Local",
                    output : "Indirect_Costs"
                },
                {
                    name : "Personnel_Total",
                    expression : "Personnel:Local_Total",
                    type : "Global",
                    output : "Personnel_Total"
                },
                {
                    name : "Equipment_Total",
                    expression : "Equipment:Local_Total",
                    type : "Global",
                    output : "Equipment_Total"
                },
                {
                    name : "Other_Goods_and_Services_Total",
                    expression : "Other_Goods_and_Services:Local_Total",
                    type : "Global",
                    output : "Other_Goods_and_Services_Total"
                },
                {
                    name : "Subcontracting_Total",
                    expression : "Subcontracting:Local_Total",
                    type : "Global",
                    output : "Subcontracting_Total"
                },
                {
                    name : "Internally_Invoiced_Services_Total",
                    expression : "Internally_Invoiced_Services:Local_Total",
                    type : "Global",
                    output : "Internally_Invoiced_Services_Total"
                },
                {
                    name : "Travel_Total",
                    expression : "Travel_Costs:Trip_Total",
                    type : "Global",
                    output : "Travel_Total"
                },
                {
                    name : "Grand_Total",
                    expression : "Totals:Personnel_Total + Totals:Equipment_Total + Totals:Other_Goods_and_Services_Total + Totals:Subcontracting_Total + Totals:Internally_Invoiced_Services_Total + Totals:Travel_Total",
                    type : "Local",
                    output : "Grand_Total"
                }
            ],
            subentries : []
        }
    ]
}

/* NEED TESTS FOR
    - getTemplate
        - Given true template
        - Given null/undefined template
    - getTemplateFromID
        - Given true id
        - Given id not in database
    - getCatNames
        - Works as intended
        - Gets blank categories section
    - getFieldNames
        - Works as intended
        - Gets blank fields section
    - findCatObject
        - Works as intended
        - Has wrong name
        - Has blank categories section
    - findFieldObject
        - Works as intended
        - Has wrong name
        - Has blank fields section
    - findCalcObject
        - Works as intended
        - Has wrong name
        - Has blank calcs section
    - getSubEntryNames
        - Works as intended
        - Gets blank subentry section
        - Is not a sub entry
    - findSubEntryObject
        - Works as intended
        - Has wrong name
        - Has blank sub entries section
        - Is not a sub entry
*/

test('getTemplate gets template', () =>
{
    expect(getTemplate(template)).toStrictEqual(truthTemplate)
})