import {readFile,writeFile} from '@meteor-it/fs';
import ArgParser from '@meteor-it/argv';
import Logger from '@meteor-it/logger';
import ConsoleReceiver from '@meteor-it/logger/receivers/node';
import {parse as parsePds, SyntaxError as PDSSyntaxError} from './ast/pds.js';
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
};

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
    let parsed;
    try{
        parsed = parsePds(file.toString());
    }catch(e){
            logger.error(`Syntax error!`);
            e.message=`${e.message} at ${input}:${e.location.start.line}:${e.location.start.column}`;
            logger.error(e.stack);
            return;
    }
    console.log(JSON.stringify(parsed,null,4));
});
parser.parse(process.argv.slice(2));