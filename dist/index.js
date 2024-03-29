"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = __importStar(require("./plugin"));
const settings_1 = __importDefault(require("./settings"));
function assignSettings(baseSettings, newSettings) {
    for (var key in newSettings) {
        if (!(key in baseSettings)) {
            Object.defineProperty(baseSettings, key, {
                get() {
                    return newSettings[key];
                },
                set(val) {
                    newSettings[key] = val;
                }
            });
        }
    }
}
function bundle(neonCore) {
    assignSettings(neonCore.settings, settings_1.default);
    return Object.assign({}, neonCore, { api: plugin });
}
exports.default = bundle;
__export(require("./plugin"));
//# sourceMappingURL=index.js.map