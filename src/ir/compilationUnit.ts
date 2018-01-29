import {Attribute, Block, Item, Statement} from "../ast/ast";

function itemsToCompilationUnit(attributesByName: Attribute[]) {
    throw new Error('unimplemented');
}

function typeToCompilationUnit(statement: Statement) {
    throw new Error('unimplemented');
}

export function blockToCompilationUnit(root: Block) {
    for(let statement of root.statements){
        let headValue = statement.items[0];
        if(!headValue.isItem())
            throw new Error('statement in root must start with item!');
        let headItem = headValue.asItem();
        let headItemName = headItem.name.toString();
        let docString = statement.getAttributesByName('doc').map(attribute=>{
            if(attribute.value.length!==1)
                throw new Error('doc attribute must have only one value!');
            if(!attribute.value[0].isString())
                throw new Error('doc attribyte must be string!');
            return attribute.value[0].asString();
        }).join('\n');
        switch(headItemName){
            case 'def': {
                if (headItem.args.length !== 1)
                    throw new Error('def must receive only one argument!');
                if (!headItem.getArg(0).isString())
                    throw new Error('argument to def must be a string!');
                let name = headItem.getArg(0).asString();
                let exports = statement.getAttributesByName('export').map(e => {
                    if (!e.isString())
                        throw new Error('export attribute must be a string!');
                    return e.toString();
                });
                let type = typeToCompilationUnit(statement);
                break;
            }
            case 'def_native': {
                if (headItem.args.length != 1)
                    throw new Error('def_native must receive only one argument!');
                if (statement.items.length != 1)
                    throw new Error('def_native statement cannot have any children!');
                let targetTypes = itemsToCompilationUnit(statement.getAttributesByName('type'));
                break;
            }
            case 'namespace': {
                if (headItem.args.length != 1)
                    throw new Error('namespace must receive only one argument!');
                if (!headItem.getArg(0).isString())
                    throw new Error('argument to def must be a string!');
                let name = headItem.getArg(0).asString();
                if (statement.items.length != 1)
                    throw new Error('namespace statement cannot have any children!');

            }
        }
    }
}