import template from "../template-Horizon-RIA.json"
import { CalculationType, CategoryType, FieldType, TemplateData } from "../src/types"
import { expect, test, vi } from 'vitest'
import { findCalcObject, findCatObject, findFieldObject, findSubEntryObject, getCatNames, getFieldsNames, getSubEntryNames, getTemplate, getTemplateFromID } from "../src/TemplateParser"

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

Also below are empty versions of the types that are typically
used as default return values
*/


export const truthTemplate : TemplateData = 
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
                    name : "Name",
                    prefix : "",
                    value : "Full Name",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
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
                    type : "Date",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "End_Date",
                    prefix : "",
                    value : "",
                    postfix : "",
                    type : "Date",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Percentage",
                    prefix : "",
                    value : "Percentage worked",
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
                }
            ],
            calculations : 
            [
                {
                    name : "Person_Months",
                    expression : "(Personnel:End_Date:M - Personnel:Start_Date:M) * (Personnel:Percentage / 100)",
                    type : "Local",
                    output : "Person_Month"
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
                    value : "What",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "Why",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                }
            ],
            calculations : 
            [
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
                    value : "What",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "Why",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                }
            ],
            calculations : 
            [
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
                    value : "Days",
                    postfix : "(no. of)",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Accomodation",
                    prefix : "€",
                    value : "Accomodation",
                    postfix : "per day",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Sustinance",
                    prefix : "€",
                    value : "Sustinance",
                    postfix : "per day",
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
                    value : "What",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
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
                    value : "What",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "Why",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                }
            ],
            calculations : 
            [
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
                    value : "What",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Why",
                    prefix : "",
                    value : "Why",
                    postfix : "",
                    type : "String",
                    displayvisible : true,
                    entryvisible : true
                },
                {
                    name : "Amount",
                    prefix : "€",
                    value : "Amount",
                    postfix : "",
                    type : "Int",
                    displayvisible : true,
                    entryvisible : true
                }
            ],
            calculations : 
            [
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
                    expression : "Personnel:Amount",
                    type : "Global",
                    output : "Personnel_Total"
                },
                {
                    name : "Equipment_Total",
                    expression : "Equipment:Amount",
                    type : "Global",
                    output : "Equipment_Total"
                },
                {
                    name : "Other_Goods_and_Services_Total",
                    expression : "Other_Goods_and_Services:Amount",
                    type : "Global",
                    output : "Other_Goods_and_Services_Total"
                },
                {
                    name : "Subcontracting_Total",
                    expression : "Subcontracting:Amount",
                    type : "Global",
                    output : "Subcontracting_Total"
                },
                {
                    name : "Internally_Invoiced_Services_Total",
                    expression : "Internally_Invoiced_Services:Amount",
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

export const emptyTemplate : TemplateData =
{
    templateName : "",
    categories : []
}

export const emptyCategory : CategoryType = 
{
    name : "",
    hassubentry : false,
    fields : [],
    calculations : [],
    subentries : []
}

export const emptyField : FieldType = 
{
    name : "",
    prefix : "",
    value : "",
    postfix : "",
    type : "",
    displayvisible : false,
    entryvisible : false
}

export const emptyCalculation : CalculationType = 
{
    name : "",
    expression : "",
    type : "",
    output : ""
}

/* TEST PLAN
    - getTemplate
        - Given true template
        - Given null/undefined template
    - getTemplateFromID
        - Given true id
            - If id not is database, query gives null so
                getTemplate tests apply from there
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
        - look for field name instead
*/

vi.mock("../src/database", () => (
{
    getProjectTemplate : vi.fn(() => Promise.resolve(template))
}
));

test('getTemplate: functional', () =>
{
    expect(getTemplate(template)).toStrictEqual(truthTemplate)
})

test('getTemplate: false template', () => 
{
    expect(getTemplate(null)).toStrictEqual({templateName : "", categories : []})
})

test('getTemplateFromID: functional', async () =>
{
    expect(await getTemplateFromID(10)).toStrictEqual(truthTemplate)
})

test('getCatNames: functional', () =>
{
    expect(getCatNames(truthTemplate)).toStrictEqual(["Personnel", "Equipment", "Other_Goods_and_Services", "Travel_Costs", "Subcontracting", "Internally_Invoiced_Services", "Totals"])
})

test('getCatNames: blank categories', () => 
{
    expect(getCatNames(emptyTemplate)).toStrictEqual([])
})

test('getFieldNames: functional', () =>
{
    expect(getFieldsNames(truthTemplate.categories[3])).toStrictEqual(["Days", "Accomodation", "Sustinance", "Base_Total", "Entry_Total", "Trip_Total"])
})

test('getFieldNames: blank fields section', () =>
{
    expect(getFieldsNames(emptyCategory)).toStrictEqual([])
})

test('findCatObject: functional', () =>
{
    expect(findCatObject("Travel_Costs", truthTemplate.categories)).toStrictEqual(truthTemplate.categories[3])
})

test('findCatObject: name not found', () =>
{
    expect(findCatObject("Staff_Costs", truthTemplate.categories)).toStrictEqual(emptyCategory)
})

test('findCatObject: blank categories section', () =>
{
    expect(findCatObject("Travel_Costs", emptyTemplate.categories)).toStrictEqual(emptyCategory)
})

test('findFieldObject: functional', () =>
{
    expect(findFieldObject("Days", truthTemplate.categories[3])).toStrictEqual(truthTemplate.categories[3].fields[0])
})
    
test('findFieldObject: name not found', () =>
{
    expect(findFieldObject("Months", truthTemplate.categories[3])).toStrictEqual(emptyField)
})
    
test('findFieldObject: blank field section', () =>
{
    expect(findFieldObject("Days", emptyCategory)).toStrictEqual(emptyField)
})

test('findCalcObject: functional', () =>
{
    expect(findCalcObject("Person_Months", truthTemplate.categories[0])).toStrictEqual(truthTemplate.categories[0].calculations[0])
})
        
test('findCalcObject: name not found', () =>
{
    expect(findCalcObject("Person_Years", truthTemplate.categories[0])).toStrictEqual(emptyCalculation)
})
        
test('findCalcObject: blank calc section', () =>
{
    expect(findCalcObject("Person_Months", emptyCategory)).toStrictEqual(emptyCalculation)
})

test('getSubEntryNames: functional', () =>
{
    expect(getSubEntryNames(truthTemplate.categories[3])).toStrictEqual(["What", "Amount"])
})

test('getSubEntryNames: blank sub entry section', () =>
{
    expect(getSubEntryNames(emptyCategory)).toStrictEqual([])
})

test('getSubEntryNames: is not a sub entry', () => 
{
    expect(getSubEntryNames(truthTemplate.categories[0])).toStrictEqual([])
})

test('findSubEntryObject: functional', () =>
{
    expect(findSubEntryObject("Amount", truthTemplate.categories[3])).toStrictEqual(truthTemplate.categories[3].subentries[1])
})

test('findSubEntryObject: name not found', () =>
{
    expect(findSubEntryObject("Why", truthTemplate.categories[3])).toStrictEqual(emptyField)
})

test('findSubEntryObject: blank sub entry section', () =>
{
    expect(findSubEntryObject("Amount", emptyCategory)).toStrictEqual(emptyField)
})

test('findSubEntryObject: is not a sub entry', () =>
{
    expect(findSubEntryObject("Amount", truthTemplate.categories[0])).toStrictEqual(emptyField)
})

test('findSubEntryObject: search field name', () =>
{
    expect(findSubEntryObject("Days", truthTemplate.categories[3])).toStrictEqual(emptyField)
})

