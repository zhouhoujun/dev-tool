"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomLoader = (function () {
    function CustomLoader(ctx, loader) {
        this.ctx = ctx;
        this.loader = loader;
    }
    CustomLoader.prototype.load = function () {
        return Promise.resolve(this.loader(this.ctx));
    };
    return CustomLoader;
}());
exports.CustomLoader = CustomLoader;

//# sourceMappingURL=../sourcemaps/loaders/CustomLoader.js.map
