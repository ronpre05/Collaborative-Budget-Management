type CalculationType =
{
    name : string;
    expression : string;
};

enum Associativity
{
    Left,
    Right,
};

type Operator = 
{
    symbol : string;
    precedence : number;
    associativity : Associativity;
};

//const operator : Operator[] =


// String of expression needs to be split into a list of strings on the spaces
// Need to create a stack