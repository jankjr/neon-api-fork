var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tx, wallet } from "@cityofzion/neon-core";
import { checkProperty } from "./common";
function addSignature(transaction, signature) {
    transaction.scripts.push(tx.Witness.deserialize(signature));
}
/**
 * Signs a transaction within the config object.
 * @param config - Configuration object.
 * @return Configuration object.
 */
export function signTx(config) {
    return __awaiter(this, void 0, void 0, function* () {
        checkProperty(config, "signingFunction", "tx");
        const signatures = yield config.signingFunction(config.tx.serialize(false), config.account.publicKey);
        if (signatures instanceof Array) {
            signatures.forEach(sig => {
                addSignature(config.tx, sig);
            });
        }
        else {
            addSignature(config.tx, signatures);
        }
        return config;
    });
}
export function signWithPrivateKey(privateKey) {
    const pubKey = new wallet.Account(privateKey).publicKey;
    return (txString, publicKey) => __awaiter(this, void 0, void 0, function* () {
        const sig = wallet.sign(txString, privateKey);
        const witness = tx.Witness.fromSignature(sig, publicKey || pubKey);
        return witness.serialize();
    });
}
//# sourceMappingURL=sign.js.map