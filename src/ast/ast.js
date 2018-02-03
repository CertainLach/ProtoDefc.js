"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toStringJoinPad(values) {
    if (values.length == 0)
        return '';
    return `\n${values.map(value => value.toString().split('\n').map(e => `\t${e}`).join('\n')).join(',\n')}\n`;
}
function pad(string) {
    return string.split('\n').map((e, i) => `\t${e}`).join('\n');
}
class ItemArg {
    constructor(tag, value) {
        this.tag = tag;
        this.value = value;
    }
    toString() {
        if (this.tag == null) {
            return this.value.toString();
        }
        else {
            return `${this.tag} = ${this.value.toString()}`;
        }
    }
}
exports.ItemArg = ItemArg;
class Item {
    constructor(name, args, block) {
        this.name = name;
        this.args = args;
        this.block = block;
    }
    getArg(id) {
        return this.args[id].value;
    }
    isEmptyBlock() {
        return this.block.toString().trim() === '';
    }
    toString() {
        return `${this.name.toString()}${this.args.length == 0 ? '' : `(${this.args.map(a => a.toString()).join(', ')})`}${this.isEmptyBlock() ? '' : `{${pad(this.block.toString())}\n}`}`;
    }
}
exports.Item = Item;
var ValueType;
(function (ValueType) {
    ValueType[ValueType["STRING"] = 0] = "STRING";
    ValueType[ValueType["ITEM"] = 1] = "ITEM";
})(ValueType || (ValueType = {}));
class Value {
    constructor(isString, value) {
        this.type = isString ? ValueType.STRING : ValueType.ITEM;
        this.value = value;
    }
    isString() {
        return this.type == ValueType.STRING;
    }
    isItem() {
        return this.type == ValueType.ITEM;
    }
    asItem() {
        if (!this.isItem())
            throw new Error('asItem() on non-item value!');
        return this.value;
    }
    asString() {
        if (!this.isString())
            throw new Error('asString() on non-item value!');
        return this.value;
    }
    asReference() {
        return Reference.fromString(this.asString());
    }
    toString() {
        if (this.isString())
            return `"${this.asString()}"`;
        else
            return this.asItem().toString();
    }
}
exports.Value = Value;
var ReferenceItemType;
(function (ReferenceItemType) {
    ReferenceItemType[ReferenceItemType["PROPERTY"] = 0] = "PROPERTY";
    ReferenceItemType[ReferenceItemType["DOWN"] = 1] = "DOWN";
    ReferenceItemType[ReferenceItemType["UP"] = 2] = "UP";
})(ReferenceItemType || (ReferenceItemType = {}));
class ReferenceItem {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}
class Reference {
    constructor(up, items) {
        this.up = up;
        this.items = items;
    }
    static fromString(string) {
        const items = [];
        for (let part of string.split('/')) {
            if (part === '..')
                items.push(new ReferenceItem(ReferenceItemType.UP));
            else if (part[0] === '@')
                items.push(new ReferenceItem(ReferenceItemType.PROPERTY, part.substr(1)));
            else
                items.push(new ReferenceItem(ReferenceItemType.DOWN, part));
        }
        return this.fromItems(items);
    }
    static fromItems(items) {
        let up = 0;
        const out = [];
        while (items[0].type == ReferenceItemType.UP) {
            up++;
            items.shift();
        }
        for (let item of items) {
            if (item.type == ReferenceItemType.UP)
                throw new Error('upward references are only allowed at beginning of reference!');
            out.push(item);
        }
        return new Reference(up, out);
    }
    toString() {
        let outString = '/..'.repeat(this.up);
        for (let item of this.items) {
            if (item.type == ReferenceItemType.DOWN) {
                outString += `/${item.name}`;
            }
            else {
                outString += `/@${item.name}`;
            }
        }
        return outString.substr(1);
    }
}
exports.Reference = Reference;
class Block {
    constructor(statements) {
        this.statements = statements;
    }
    toString() {
        return `${this.statements.map(e => e.toString()).join('\n')}`;
    }
}
exports.Block = Block;
class Attribute {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    toString() {
        return `@${this.name} ${this.value.map(v => v.toString())}`;
    }
}
exports.Attribute = Attribute;
class Statement {
    constructor(attributes, items) {
        this.attributes = attributes;
        this.items = items;
    }
    getAttributesByName(name) {
        return this.attributes.filter(attribute => attribute[0] === name).map(attribute => attribute[1]);
    }
    toString() {
        return `${this.attributes.map(attr => attr.toString()).join('\n')}\n${this.items.map(item => item.toString()).join(' => ')};`;
    }
}
exports.Statement = Statement;
class Ident {
    constructor(absolute, parts) {
        this.absoulte = absolute;
        this.parts = parts;
    }
    toString() {
        return `${this.absoulte ? '::' : ''}${this.parts.join('::')}`;
    }
}
exports.Ident = Ident;
