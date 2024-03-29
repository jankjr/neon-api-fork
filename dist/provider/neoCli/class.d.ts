import { u, wallet } from "@cityofzion/neon-core";
import { PastTransaction, Provider } from "../common";
export declare class NeoCli implements Provider {
    readonly name: string;
    private url;
    private rpc;
    constructor(url: string);
    getRPCEndpoint(noCache?: boolean | undefined): Promise<string>;
    getBalance(address: string): Promise<wallet.Balance>;
    getClaims(address: string): Promise<wallet.Claims>;
    getMaxClaimAmount(address: string): Promise<u.Fixed8>;
    getHeight(): Promise<number>;
    getTransactionHistory(address: string): Promise<PastTransaction[]>;
}
export default NeoCli;
//# sourceMappingURL=class.d.ts.map