"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var development_core_1 = require("development-core");
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
var Context = (function (_super) {
    __extends(Context, _super);
    // private children: IContext[] = [];
    function Context(cfg, parent) {
        return _super.call(this, cfg, parent) || this;
    }
    return Context;
}(development_core_1.TaskContext));
exports.Context = Context;

//# sourceMappingURL=sourcemaps/Context.js.map
