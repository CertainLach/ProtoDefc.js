"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("@meteor-it/fs");
const argv_1 = require("@meteor-it/argv");
const logger_1 = require("@meteor-it/logger");
const node_1 = require("@meteor-it/logger/receivers/node");
const pds_js_1 = require("./ast/pds.js");
logger_1.default.addReceiver(new node_1.default());
class JavaBackend {
    compile(data) {
        throw new Error("Method not implemented.");
    }
}
const backends = {
    java: new JavaBackend()
};
const parser = new argv_1.default('protodefc');
const logger = parser.logger;
parser.command('compile').option('input', {
    required: true
}).option('output', {
    required: false
}).option('target', {
    required: true
}).callback(({ input, output, target }) => __awaiter(this, void 0, void 0, function* () {
    logger.ident('Info');
    logger.log('Input: ', input.green);
    logger.log('Output:', (output || '<stdout>').green);
    logger.log('Target:', target.yellow);
    logger.deent();
    if (!backends[target])
        throw new Error('no such backend: ' + target);
    const file = yield fs_1.readFile(input);
    logger.log(`Read ${file.length.toString().green} bytes from definition, parsing...`);
    let parsed;
    try {
        parsed = pds_js_1.parse(file.toString());
    }
    catch (e) {
        logger.error(`Syntax error!`);
        e.message = `${e.message} at ${input}:${e.location.start.line}:${e.location.start.column}`;
        logger.error(e.stack);
        return;
    }
    console.log(JSON.stringify(parsed, null, 4));
}));
parser.parse(process.argv.slice(2));
