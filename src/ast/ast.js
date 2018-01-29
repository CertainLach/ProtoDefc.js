"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ItemArg {
    constructor(tag, value) {
        this.tag = tag;
        this.value = value;
    }
}
exports.ItemArg = ItemArg;
class Item {
    constructor(name, args, block) {
        this.name = name;
        this.args = args;
        this.block = block;
    }
}
exports.Item = Item;
class Block {
    constructor(statements) {
        this.statements = statements;
    }
}
exports.Block = Block;
class Statement {
    constructor(attributes, items) {
        this.attributes = attributes;
        this.items = items;
    }
}
exports.Statement = Statement;
class Ident {
    constructor(absolute, parts) {
        this.absoulte = absolute;
        this.parts = parts;
    }
}
exports.Ident = Ident;
