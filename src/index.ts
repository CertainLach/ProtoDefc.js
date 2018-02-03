import {readFile, writeFile} from '@meteor-it/fs';
import ArgParser from '@meteor-it/argv';
import Logger from '@meteor-it/logger';
import ConsoleReceiver from '@meteor-it/logger/receivers/node';
import {parse as parsePds} from './ast/pds.js';
import {Block} from "./ast/ast";

Logger.addReceiver(new ConsoleReceiver());

interface Backend {
    getExt(): string;
    compile(data: Block): string;
}

class JavaBackend implements Backend {
    getExt(): string {
        return 'java';
    }

    compile(data: Block): string {
        throw new Error("Method not implemented.");
    }
}

/**
 * Usable for code formatting
 */
class PDSBackend implements Backend{
    getExt(): string {
        return 'pds';
    }
    compile(data: Block): string {
        return data.toString();
    }
}

const backends = {
    java: new JavaBackend(),
    pds: new PDSBackend()
};

const parser = new ArgParser('protodefc');
const logger = parser.logger;
parser.command('compile').option('input', {
    required: true
}).option('output', {
    required: false
}).option('target', {
    required: true
}).callback(async ({input, output, target}) => {
    logger.ident('Info');
    logger.log('Input: ', input.green);
    logger.log('Output:', (output || '<stdout>').green);
    logger.log('Target:', target.yellow);
    logger.deent();
    if (!backends[target])
        throw new Error('no such backend: ' + target);
    const file = await readFile(input);
    logger.log(`Read ${file.length.toString().green} bytes from definition, parsing...`);
    let parsed;
    try {
        parsed = parsePds(file.toString());
    } catch (e) {
        logger.error(`Syntax error!`);
        e.message = `${e.message} at ${input}:${e.location.start.line}:${e.location.start.column}`;
        logger.error(e.stack);
        return;
    }
    logger.log('Compiling...');
    const compiled=backends[target].compile(parsed);
    logger.log(`Compiled, output size: ${compiled.length.toString().green} bytes. Writing to ${output}.${backends[target].getExt()}`);
    await writeFile(`${output}.${backends[target].getExt()}`, compiled);
});
parser.parse(process.argv.slice(2));