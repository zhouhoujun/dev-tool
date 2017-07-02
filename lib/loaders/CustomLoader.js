"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomLoader = (function () {
    function CustomLoader(ctx, loader) {
        this.ctx = ctx;
        this.loader = loader;
        this.name = 'custom';
    }
    CustomLoader.prototype.load = function () {
        if (!this.tasks) {
            this.tasks = Promise.resolve(this.loader(this.ctx));
        }
        return this.tasks;
    };
    return CustomLoader;
}());
exports.CustomLoader = CustomLoader;

//# sourceMappingURL=../sourcemaps/loaders/CustomLoader.js.map
