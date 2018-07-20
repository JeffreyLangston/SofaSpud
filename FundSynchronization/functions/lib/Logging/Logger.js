"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
class Logger {
    constructor() {
        this.SystemConfig = chalk_1.default.bold.underline.white.bgMagenta;
        this.ErrorConfig = chalk_1.default.bold.red;
        this.InformationConfig = chalk_1.default.white;
        this.DataConfig = chalk_1.default.blue;
        this.SuccessConfig = chalk_1.default.green;
    }
    System(message) {
        console.log(this.SystemConfig(message));
    }
    Error(message) {
        console.log(this.ErrorConfig(message));
    }
    Information(message) {
        console.log(this.InformationConfig(message));
    }
    Data(message) {
        console.log(this.DataConfig(message));
    }
    Success(message) {
        console.log(this.SuccessConfig(message));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map