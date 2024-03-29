var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { logging } from "@cityofzion/neon-core";
const log = logging.default("api");
export default class ApiBalancer {
    constructor(leftProvider, rightProvider, preference = 0, frozen = false) {
        // tslint:disable-next-line:variable-name
        this._preference = 0;
        // tslint:disable-next-line:variable-name
        this._frozen = false;
        this.leftProvider = leftProvider;
        this.rightProvider = rightProvider;
        this.preference = preference;
        this.frozen = frozen;
    }
    get name() {
        return `${this.leftProvider.name}ApiBalancer${this.rightProvider.name}`;
    }
    get preference() {
        return this._preference;
    }
    set preference(val) {
        const newVal = Math.max(0, Math.min(1, val));
        if (newVal !== this._preference) {
            log.info(`Preference set to ${newVal}`);
        }
        this._preference = newVal;
    }
    get frozen() {
        return this._frozen;
    }
    set frozen(val) {
        if (this._frozen !== val) {
            val
                ? log.info(`ApiBalancer frozen at preference of ${this._preference}`)
                : log.info("ApiBalancer unfrozen");
        }
        this._frozen = val;
    }
    getRPCEndpoint() {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getRPCEndpoint(); });
            return yield this.loadBalance(f);
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getBalance(address); });
            return yield this.loadBalance(f);
        });
    }
    getClaims(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getClaims(address); });
            return yield this.loadBalance(f);
        });
    }
    getMaxClaimAmount(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getMaxClaimAmount(address); });
            return yield this.loadBalance(f);
        });
    }
    getHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getHeight(); });
            return yield this.loadBalance(f);
        });
    }
    getTransactionHistory(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const f = (p) => __awaiter(this, void 0, void 0, function* () { return yield p.getTransactionHistory(address); });
            return yield this.loadBalance(f);
        });
    }
    /**
     * Load balances a API call according to the API switch. Selects the appropriate provider and sends the call towards it.
     * @param func - The API call to load balance function
     */
    loadBalance(func) {
        return __awaiter(this, void 0, void 0, function* () {
            const i = Math.random() > this._preference ? 0 : 1;
            const primary = i === 0 ? this.leftProvider : this.rightProvider;
            const primaryShift = i === 0;
            try {
                const result = yield func(primary);
                i === 0 ? this.increaseLeftWeight() : this.increaseRightWeight();
                return result;
            }
            catch (_a) {
                const secondary = i === 0 ? this.rightProvider : this.leftProvider;
                i === 1 ? this.increaseLeftWeight() : this.increaseRightWeight();
                return yield func(secondary);
            }
        });
    }
    increaseLeftWeight() {
        if (!this._frozen) {
            this.preference -= 0.2;
            log.info(`core API Switch increasing weight towards ${this.leftProvider.name}`);
        }
    }
    increaseRightWeight() {
        if (!this._frozen) {
            this.preference += 0.2;
            log.info(`core API Switch increasing weight towards ${this.rightProvider.name}`);
        }
    }
}
//# sourceMappingURL=apiBalancer.js.map