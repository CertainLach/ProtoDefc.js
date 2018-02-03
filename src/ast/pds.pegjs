{
    const {Block, Statement, Item, ItemArg, Ident, Value, Attribute} = require('./ast.js');
    const {default:Logger} = require('@meteor-it/logger');
    const parseLogger = new Logger('parser');
}

root
	= __ statements:statement*
    {return new Block(statements)}

// Statement
statement
	= attributes:statementAttr* items:valueChain semicolon
    {return new Statement(attributes,items)}
statementAttr
	= '@' name:baseIdent val:valueChain __
    {return new Attribute(name,val)}

// Value
valueChain 
	= a:value __ hashrocket __ b:valueChain
    {return [a,...b]}
    / v:value
    {return [v]}
value
	= s:string 
    {return new Value(true, s)}
    / i:item 
    {return new Value(false, i)}

// Item
item
	= identifier:identifier args:itemArgs? __ block:itemBlock? 
    {return new Item(identifier,args==null?[]:args,block==null?new Block([]):block)}
itemArgs
	= parenOpen args:itemArgList parenClose __ 
    {return args}
/*REC*/
itemArgList
    = a:itemArg comma b:itemArgList
    {return [a,...b]}
    / i:itemArg
    {return [i]}
itemArg
	= tag:(t:baseIdent ':' {return t})? __ value:value __ 
    {return new ItemArg(tag,value)}
itemBlock
	= blockOpen statements:statement* blockClose __ 
    {return new Block(statements)}
    
// String
string "string"
	= '"' chars:stringChar* '"' 
    {return chars.join('')}
    / '"""' chars:(!'"""' .)* '"""' 
    {return chars.join('') /*TODO: Multiline comments (Doesn't work somehow)*/}
stringChar
	= c:[^"]+ 
    {return c.join('')}

// Identifiers
identifier "namespaced identifier"
	= i:innerIdentifier 
    {return i}
innerIdentifier
    = "::" list:identList {return new Ident(true, list)}
    / list:identList {return new Ident(false, list)}
/*REC*/
identList
    = a:baseIdent "::" b:identList
    {return [a,...b]}
    / i:baseIdent 
    {return [i]}
baseIdent
    = chars:$([0-9a-zA-Z_]+) __ 
    {return chars}

// Operators
hashrocket 
	= "=>" __
parenOpen "paren open" 
	= "(" __
parenClose "paren close"
	= ")" __
blockOpen "block open"
	= "{" __
blockClose "block close"
	= "}" __
comma 
	= "," __
semicolon "semicolon"
	= ";" __

// Whitespace
__ "whitespace"
	= (whitespace / eol)*
whitespace
    = [ \t]
eolChar
    = [\n\r]
eol
    = "\n"
    / "\r\n"