export class ItemArg {
    tag?: string;
    value: Value;
    constructor(tag: string, value: Value) {
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
    getArg(id:number){
        return this.args[id].value;
    }
}
enum ValueType {
    STRING,
    ITEM
}
export class Value {
    type: ValueType;
    value: string|Item;
    constructor(isString:boolean,value:string|Item){
        this.type = isString?ValueType.STRING:ValueType.ITEM;
        this.value = value;
    }
    isString():boolean{
        return this.type==ValueType.STRING;
    }
    isItem():boolean{
        return this.type==ValueType.ITEM;
    }
    asItem():Item{
        if(!this.isItem())
            throw new Error('asItem() on non-item value!');
        return <Item>this.value;
    }
    asString():string{
        if(!this.isString())
            throw new Error('asString() on non-item value!');
        return <string>this.value;
    }
    asReference():Reference{
        return Reference.fromString(this.asString());
    }
}
enum ReferenceItemType {
    PROPERTY,
    DOWN,
    UP
}
class ReferenceItem<T extends ReferenceItemType>{
    type:T;
    name?:string;
    constructor(type:T, name?:string){
        this.type=type;
        this.name=name;
    }
}
export class Reference{
    up: number;
    items: ReferenceItem<ReferenceItemType.DOWN|ReferenceItemType.PROPERTY>[];
    constructor(up:number, items: ReferenceItem<ReferenceItemType.DOWN|ReferenceItemType.PROPERTY>[]){
        this.up = up;
        this.items = items;
    }
    toString(){
        let outString = '/..'.repeat(this.up);
        for(let item of this.items){
            if(item.type==ReferenceItemType.DOWN){
                outString+=`/${item.name}`;
            }else{
                outString+=`/@${item.name}`;
            }
        }
        return outString.substr(1);
    }
    static fromString(string){
        const items = [];
        for(let part of string.split('/')){
            if(part==='..')
                items.push(new ReferenceItem(ReferenceItemType.UP));
            else if(part[0]==='@')
                items.push(new ReferenceItem(ReferenceItemType.PROPERTY,part.substr(1)));
            else
                items.push(new ReferenceItem(ReferenceItemType.DOWN,part));
        }
        return this.fromItems(items);
    }
    static fromItems(items:ReferenceItem<ReferenceItemType.DOWN|ReferenceItemType.PROPERTY|ReferenceItemType.UP>[]){
        let up = 0;
        const out=[];
        while (items[0].type==ReferenceItemType.UP){
            up++;
            items.shift();
        }
        for(let item of items){
            if(item.type==ReferenceItemType.UP)
                throw new Error('upward references are only allowed at beginning of reference!');
            out.push(item);
        }
        return new Reference(up,out);
    }


}
export class Block {
    statements: Statement[];
    constructor(statements: Statement[]) {
        this.statements = statements;
    }
}
export class Attribute {
    name:string;
    value:Value[];
    constructor(name:string,value:Value[]){
        this.name=name;
        this.value=value;
    }
}
export class Statement {
    attributes: Attribute[];
    items: Value[];
    constructor(attributes, items){
        this.attributes = attributes;
        this.items = items;
    }
    getAttributesByName(name:string){
        return this.attributes.filter(attribute=>attribute[0]===name).map(attribute=>attribute[1]);
    }
}
export class Ident {
    absoulte: boolean;
    parts: string[];
    constructor(absolute: boolean, parts: string[]) {
        this.absoulte = absolute;
        this.parts = parts;
    }
    toString(){
        return `${this.absoulte?'::':''}${this.parts.join('::')}`
    }
}