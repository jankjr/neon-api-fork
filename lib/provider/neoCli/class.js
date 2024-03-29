import { logging, rpc } from "@cityofzion/neon-core";
import { getBalance, getClaims, getMaxClaimAmount } from "./core";
const log = logging.default("api");
export class NeoCli {
    get name() {
        return `NeoCli[${this.url}]`;
    }
    constructor(url) {
        this.url = url;
        this.rpc = new rpc.RPCClient(url);
        log.info(`Created NeoCli Provider: ${this.url}`);
    }
    getRPCEndpoint(noCache) {
        return Promise.resolve(this.url);
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
        return this.rpc.getBlockCount();
    }
    getTransactionHistory(address) {
        throw new Error("Method not implemented.");
    }
}
export default NeoCli;
//# sourceMappingURL=class.js.map