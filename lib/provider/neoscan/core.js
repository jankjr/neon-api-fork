var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CONST, logging, u, wallet } from "@cityofzion/neon-core";
import * as internal from "../../settings";
import axios from "axios";
import { filterHttpsOnly, findGoodNodesFromHeight, getBestUrl } from "../common";
const log = logging.default("api");
function parseUnspent(unspentArr) {
    return unspentArr.map(coin => {
        return {
            index: coin.n,
            txid: coin.txid,
            value: coin.value
        };
    });
}
function parseClaims(claimArr) {
    return claimArr.map(c => {
        return {
            start: c.start_height,
            end: c.end_height,
            index: c.n,
            claim: c.unclaimed,
            txid: c.txid,
            value: c.value
        };
    });
}
function getChange(vin, vout, assetId) {
    const totalOut = vin
        .filter(i => i.asset === assetId)
        .reduce((p, c) => p.add(c.value), new u.Fixed8(0));
    const totalIn = vout
        .filter(i => i.asset === assetId)
        .reduce((p, c) => p.add(c.value), new u.Fixed8(0));
    return totalIn.minus(totalOut);
}
function parseTxHistory(rawTxs, address) {
    return rawTxs.map(tx => {
        const vin = tx.vin
            .filter(i => i.address_hash === address)
            .map(i => ({ asset: i.asset, value: i.value }));
        const vout = tx.vouts
            .filter(o => o.address_hash === address)
            .map(i => ({ asset: i.asset, value: i.value }));
        const change = {
            NEO: getChange(vin, vout, CONST.ASSET_ID.NEO),
            GAS: getChange(vin, vout, CONST.ASSET_ID.GAS)
        };
        return {
            txid: tx.txid,
            blockHeight: tx.block_height,
            change
        };
    });
}
/**
 * Returns an appropriate RPC endpoint retrieved from a NeoScan endpoint.
 * @param url - URL of a neoscan service.
 * @returns URL of a good RPC endpoint.
 */
export function getRPCEndpoint(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_all_nodes");
        let nodes = response.data;
        if (internal.settings.httpsOnly) {
            nodes = filterHttpsOnly(nodes);
        }
        const goodNodes = findGoodNodesFromHeight(nodes);
        const bestRPC = yield getBestUrl(goodNodes);
        return bestRPC;
    });
}
/**
 * Gets balance for an address. Returns an empty Balance if endpoint returns not found.
 * @param url - URL of a neoscan service.
 * @param address Address to check.
 * @return Balance of address retrieved from endpoint.
 */
export function getBalance(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_balance/" + address);
        const data = response.data;
        if (data.address === "not found" && data.balance === null) {
            return new wallet.Balance({ net: url, address });
        }
        const bal = new wallet.Balance({
            net: url,
            address: data.address
        });
        const neoscanBalances = data.balance;
        for (const b of neoscanBalances) {
            if (b.amount > 0 && b.unspent.length > 0) {
                bal.addAsset(b.asset, {
                    unspent: parseUnspent(b.unspent)
                });
            }
            else {
                bal.addToken(b.asset, b.amount);
            }
        }
        log.info(`Retrieved Balance for ${address} from neoscan ${url}`);
        return bal;
    });
}
/**
 * Get claimable amounts for an address. Returns an empty Claims if endpoint returns not found.
 * @param url - URL of a neoscan service.
 * @param address - Address to check.
 * @return Claims retrieved from endpoint.
 */
export function getClaims(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_claimable/" + address);
        const data = response.data;
        if (data.address === "not found" && data.claimable === null) {
            return new wallet.Claims({ address: data.address });
        }
        const claims = parseClaims(data.claimable);
        log.info(`Retrieved Claims for ${address} from neoscan ${url}`);
        return new wallet.Claims({
            net: url,
            address: data.address,
            claims
        });
    });
}
/**
 * Gets the maximum amount of gas claimable after spending all NEO.
 * @param url - URL of a neoscan service.
 * @param address Address to check.
 * @return
 */
export function getMaxClaimAmount(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_unclaimed/" + address);
        const data = response.data;
        log.info(`Retrieved maximum amount of gas claimable after spending all NEO for ${address} from neoscan ${url}`);
        return new u.Fixed8(data.unclaimed || 0);
    });
}
/**
 * Get the current height of the light wallet DB
 * @param url - URL of a neoscan service.
 * @return  Current height as reported by provider
 */
export function getHeight(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_height");
        const data = response.data;
        return data.height;
    });
}
/**
 * Get transaction history for an account
 * @param {string} net - 'MainNet' or 'TestNet'.
 * @param {string} address - Address to check.
 * @return {Promise<PastTransaction[]>} A listof PastTransactionPastTransaction[]
 */
export function getTransactionHistory(url, address) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios.get(url + "/v1/get_last_transactions_by_address/" + address);
        const data = response.data;
        log.info(`Retrieved History for ${address} from neoscan ${url}`);
        return parseTxHistory(response.data, address);
    });
}
//# sourceMappingURL=core.js.map