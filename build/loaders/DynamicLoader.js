"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var contextDefine_1 = require("../utils/contextDefine");
var BaseLoader_1 = require("./BaseLoader");
var DynamicLoader = (function (_super) {
    __extends(DynamicLoader, _super);
    function DynamicLoader(option, env, factory) {
        return _super.call(this, option, env, factory) || this;
    }
    DynamicLoader.prototype.getContextDefine = function () {
        return contextDefine_1.default(this.getTaskModule());
    };
    return DynamicLoader;
}(BaseLoader_1.BaseLoader));
exports.DynamicLoader = DynamicLoader;

//# sourceMappingURL=../sourcemaps/loaders/DynamicLoader.js.map
