import * as plugin from "./plugin";
import { default as apiSettings } from "./settings";
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
    assignSettings(neonCore.settings, apiSettings);
    return Object.assign({}, neonCore, { api: plugin });
}
export default bundle;
export * from "./plugin";
//# sourceMappingURL=index.js.map