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
const neon_core_1 = require("@cityofzion/neon-core");
const core_1 = require("./core");
const log = neon_core_1.logging.default("api");
class Neoscan {
    constructor(url) {
        this.rpc = null;
        this.cacheExpiry = null;
        if (neon_core_1.settings.networks[url] && neon_core_1.settings.networks[url].extra.neoscan) {
            this.url = neon_core_1.settings.networks[url].extra.neoscan;
        }
        else {
            this.url = url;
        }
        log.info(`Created Neoscan Provider: ${this.url}`);
    }
    get name() {
        return `Neoscan[${this.url}]`;
    }
    getRPCEndpoint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rpc && this.cacheExpiry && this.cacheExpiry < new Date()) {
                const ping = yield this.rpc.ping();
                if (ping <= 1000) {
                    return this.rpc.net;
                }
            }
            const rpcAddress = yield core_1.getRPCEndpoint(this.url);
            this.rpc = new neon_core_1.rpc.RPCClient(rpcAddress);
            this.cacheExpiry = new Date(new Date().getTime() + 5 * 60000);
            return this.rpc.net;
        });
    }
    getBalance(address) {
        return core_1.getBalance(this.url, address);
    }
    getClaims(address) {
        return core_1.getClaims(this.url, address);
    }
    getMaxClaimAmount(address) {
        return core_1.getMaxClaimAmount(this.url, address);
    }
    getHeight() {
        return core_1.getHeight(this.url);
    }
    getTransactionHistory(address) {
        return core_1.getTransactionHistory(this.url, address);
    }
}
exports.Neoscan = Neoscan;
exports.default = Neoscan;
//# sourceMappingURL=class.js.map