var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CONST, logging, u, wallet } from "@cityofzion/neon-core";
import axios from "axios";
const log = logging.default("api");
const BASE_REQ = CONST.DEFAULT_REQ;
function throwRpcError(err) {
    throw new Error(`Encounter error code ${err.code}: ${err.message}`);
}
export function getRPCEndpoint(url) {
    return url;
}
function convertNeoCliTx(tx) {
    return { index: tx.n, txid: tx.txid, value: tx.value };
}
function convertNeoCliClaimable(c) {
    return {
        claim: c.unclaimed,
        txid: c.txid,
        index: c.n,
        value: c.value,
        start: c.start_height,
        end: c.end_height
    };
}
/**
 * Get balances of NEO and GAS for an address
 * @param url - URL of a neonDB service.
 * @param address - Address to check.
 * @return  Balance of address
 */
export function getBalance(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.post(url, Object.assign({}, BASE_REQ, { method: "getunspents", params: [address] }));
        const data = response.data;
        if (data.error) {
            throwRpcError(data.error);
        }
        const bal = new wallet.Balance({
            net: url,
            address: data.result.address
        });
        for (const assetBalance of data.result.balance) {
            if (assetBalance.amount === 0) {
                continue;
            }
            if (assetBalance.unspent.length > 0) {
                bal.addAsset(assetBalance.asset_symbol, {
                    unspent: assetBalance.unspent.map(convertNeoCliTx)
                });
            }
            else {
                bal.addToken(assetBalance.asset_symbol, assetBalance.amount);
            }
        }
        log.info(`Retrieved Balance for ${address} from neonDB ${url}`);
        return bal;
    });
}
export function getClaims(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.post(url, Object.assign({}, BASE_REQ, { method: "getclaimable", params: [address] }));
        const data = response.data;
        if (data.error) {
            throwRpcError(data.error);
        }
        return new wallet.Claims({
            net: url,
            address: data.result.address,
            claims: data.result.claimable.map(convertNeoCliClaimable)
        });
    });
}
export function getMaxClaimAmount(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.post(url, Object.assign({}, BASE_REQ, { method: "getunclaimed", params: [address] }));
        const data = response.data;
        if (data.error) {
            throwRpcError(data.error);
        }
        return new u.Fixed8(data.result.unclaimed).div(100000000);
    });
}
//# sourceMappingURL=core.js.map