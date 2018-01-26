"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("@meteor-it/fs");
var argv_1 = require("@meteor-it/argv");
var logger_1 = require("@meteor-it/logger");
var node_1 = require("@meteor-it/logger/receivers/node");
var parser_js_1 = require("./parser.js");
logger_1.default.addReceiver(new node_1.default());
var JavaBackend = /** @class */ (function () {
    function JavaBackend() {
    }
    JavaBackend.prototype.compile = function (data) {
        throw new Error("Method not implemented.");
    };
    return JavaBackend;
}());
var backends = {
    java: new JavaBackend()
};
var Item = /** @class */ (function () {
    function Item(ast) {
        if (ast.type !== 'item')
            throw new Error('Wrong parsed output!');
    }
    return Item;
}());
var String = /** @class */ (function () {
    function String(ast) {
        if (ast.type !== 'string')
            throw new Error('Wrong parsed output!');
        this.value = ast.value;
    }
    return String;
}());
var ItemArg = /** @class */ (function () {
    function ItemArg(ast) {
        if (ast.type !== 'itemArg')
            throw new Error('Wrong parsed output!');
        if (ast.value.type === 'string')
            this.value = new String(ast.value);
        else if (ast.value.type === 'item')
            this.value = new Item(ast.value);
        else
            throw new Error('Wrong parsed output!');
    }
    return ItemArg;
}());
var Statement = /** @class */ (function () {
    function Statement(ast) {
        if (ast.type !== 'statement')
            throw new Error('Wrong parsed output!');
        console.log(ast.attributes);
    }
    return Statement;
}());
var Block = /** @class */ (function () {
    function Block(ast) {
        var _this = this;
        this.statements = [];
        if (ast.type !== 'block')
            throw new Error('Wrong parsed output!');
        ast.statements.forEach(function (statement) {
            _this.statements.push(new Statement(statement));
        });
    }
    return Block;
}());
var parser = new argv_1.default('protodefc');
var logger = parser.logger;
parser.command('compile').option('input', {
    required: true
}).option('output', {
    required: false
}).option('target', {
    required: true
}).callback(function (_a) {
    var input = _a.input, output = _a.output, target = _a.target;
    return __awaiter(_this, void 0, void 0, function () {
        var file, parsed, parsedJson, ast;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger.ident('Info');
                    logger.log('Input: ', input.green);
                    logger.log('Output:', (output || '<stdout>').green);
                    logger.log('Target:', target.yellow);
                    logger.deent();
                    if (!backends[target])
                        throw new Error('no such backend: ' + target);
                    return [4 /*yield*/, fs_1.readFile(input)];
                case 1:
                    file = _b.sent();
                    logger.log("Read " + file.length.toString().green + " bytes from definition, parsing...");
                    parsed = parser_js_1.parse(file.toString());
                    parsedJson = JSON.stringify(parsed, null, 4);
                    logger.log("Got " + parsedJson.length.toString().green + " bytes of parsed json, writing them in temp file");
                    return [4 /*yield*/, fs_1.writeFile(input + '.parsed.json', parsedJson)];
                case 2:
                    _b.sent();
                    logger.log('Written parsed. Generating AST from parsed file');
                    ast = new Block(parsed);
                    console.log(ast);
                    return [2 /*return*/];
            }
        });
    });
});
parser.parse(process.argv.slice(2));
