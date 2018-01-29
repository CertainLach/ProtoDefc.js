export class ItemArg {
    tag?: string;
    value: string | Item;
    constructor(tag: string, value: string | Item) {
        this.tag = tag;
        this.value = value;
    }
}
export class Item {
    name: Ident;
    args: ItemArg[];
    block: Block;
    constructor(name: Ident, args: ItemArg[], block: Block) {
        this.name = name;
        this.args = args;
        this.block = block;
    }
}
export class Block {
    statements: Statement[];
    constructor(statements: Statement[]) {
        this.statements = statements;
    }
}
export class Statement {
    attributes: [string,(string|Item)[]][]
    items: (string|Item)[]
    constructor(attributes, items){
        this.attributes = attributes;
        this.items = items;
    }
}
export class Ident {
    absoulte: boolean;
    parts: string[];
    constructor(absolute: boolean, parts: string[]) {
        this.absoulte = absolute;
        this.parts = parts;
    }
}