import {readFile,writeFile} from '@meteor-it/fs';
import ArgParser from '@meteor-it/argv';
import Logger from '@meteor-it/logger';
import ConsoleReceiver from '@meteor-it/logger/receivers/node';
import {parse as parsePds} from './parser.js';
Logger.addReceiver(new ConsoleReceiver());

interface Backend {
    compile(data:any);
}
class JavaBackend implements Backend {
    compile(data: any) {
        throw new Error("Method not implemented.");
    }
}
const backends={
    java:new JavaBackend()
}

interface Value {}

class Item implements Value {
    name: string;
    args: ItemArg[];
    block?: Block
    constructor(ast:any){
        if(ast.type!=='item')
            throw new Error('Wrong parsed output!');
    }
}

class String implements Value{
    value:string;
    constructor(ast:any){
        if(ast.type!=='string')
            throw new Error('Wrong parsed output!');
        this.value=ast.value;
    }
}

class ItemArg{
    tag?: string;
    value: Value;
    constructor(ast:any){
        if(ast.type!=='itemArg')
            throw new Error('Wrong parsed output!');
        if(ast.value.type==='string')
            this.value=new String(ast.value);
        else if(ast.value.type==='item')
            this.value = new Item(ast.value);
        else
            throw new Error('Wrong parsed output!');
    }
}

class Statement{
    attributes: {[key:string]: Value[]}
    items: Value[]
    constructor(ast:any){
        if(ast.type!=='statement')
            throw new Error('Wrong parsed output!');
        console.log(ast.attributes);
    }
}

class Block {
    statements = [];
    constructor(ast:any){
        if(ast.type!=='block')
            throw new Error('Wrong parsed output!');
        ast.statements.forEach(statement=>{
            this.statements.push(new Statement(statement));
        })
    }
}

const parser=new ArgParser('protodefc');
const logger= parser.logger;
parser.command('compile').option('input',{
    required: true
}).option('output',{
    required: false  
}).option('target',{
    required: true
}).callback(async ({input,output,target})=>{
    logger.ident('Info');
    logger.log('Input: ',input.green);
    logger.log('Output:',(output||'<stdout>').green);
    logger.log('Target:',target.yellow);
    logger.deent();
    if(!backends[target])
        throw new Error('no such backend: '+target);
    const file = await readFile(input);
    logger.log(`Read ${file.length.toString().green} bytes from definition, parsing...`);
    const parsed = parsePds(file.toString());
    const parsedJson = JSON.stringify(parsed,null,4);
    logger.log(`Got ${parsedJson.length.toString().green} bytes of parsed json, writing them in temp file`);
    await writeFile(input+'.parsed.json',parsedJson);
    logger.log('Written parsed. Generating AST from parsed file');
    const ast = new Block(parsed);
    console.log(ast);
})
parser.parse(process.argv.slice(2));