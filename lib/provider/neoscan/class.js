var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { logging, rpc, settings } from "@cityofzion/neon-core";
import { getBalance, getClaims, getHeight, getMaxClaimAmount, getRPCEndpoint, getTransactionHistory } from "./core";
const log = logging.default("api");
export class Neoscan {
    constructor(url) {
        this.rpc = null;
        this.cacheExpiry = null;
        if (settings.networks[url] && settings.networks[url].extra.neoscan) {
            this.url = settings.networks[url].extra.neoscan;
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
            const rpcAddress = yield getRPCEndpoint(this.url);
            this.rpc = new rpc.RPCClient(rpcAddress);
            this.cacheExpiry = new Date(new Date().getTime() + 5 * 60000);
            return this.rpc.net;
        });
    }
    getBalance(address) {
        return getBalance(this.url, address);
    }
    getClaims(address) {
        return getClaims(this.url, address);
    }
    getMaxClaimAmount(address) {
        return getMaxClaimAmount(this.url, address);
    }
    getHeight() {
        return getHeight(this.url);
    }
    getTransactionHistory(address) {
        return getTransactionHistory(this.url, address);
    }
}
export default Neoscan;
//# sourceMappingURL=class.js.map