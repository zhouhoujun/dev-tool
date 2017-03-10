"use strict";
var development_core_1 = require("development-core");
var CustomLoader = (function () {
    function CustomLoader(option, loader, factory) {
        this.option = option;
        this.loader = loader;
        this.factory = factory;
    }
    CustomLoader.prototype.load = function (context) {
        return Promise.resolve(this.loader(context));
    };
    CustomLoader.prototype.loadContext = function (env) {
        var self = this;
        this.condef = this.condef || Promise.resolve(development_core_1.bindingConfig({
            option: self.option,
            env: env,
            createContext: self.factory
        }));
        return this.condef;
    };
    return CustomLoader;
}());
exports.CustomLoader = CustomLoader;

//# sourceMappingURL=../sourcemaps/loaders/CustomLoader.js.map
