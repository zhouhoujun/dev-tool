"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var loaderFactory_1 = require("./loaderFactory");
var Builder_1 = require("./Builder");
var development_core_1 = require("development-core");
var factory = new loaderFactory_1.LoaderFactory();
var builder = new Builder_1.ContextBuilder();
/**
 * Context.
 *
 * @export
 * @class Context
 * @extends {TaskContext}
 * @implements {IContext}
 */
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context(cfg) {
        var _this = _super.call(this, cfg) || this;
        _this.builder = builder;
        return _this;
    }
    Object.defineProperty(Context.prototype, "loaderFactory", {
        get: function () {
            return this._loaderfactory || factory;
        },
        set: function (fac) {
            this._loaderfactory = fac;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * create new context;
     *
     * @param {ITaskConfig} cfg
     * @returns {ITaskContext}
     * @memberof TaskContext
     */
    Context.prototype.createContext = function (cfg) {
        return new Context(cfg);
    };
    Context.prototype.getLoader = function () {
        if (!this._loader) {
            this._loader = this.loaderFactory.create(this);
        }
        return this._loader;
    };
    return Context;
}(development_core_1.TaskContext));
exports.Context = Context;

//# sourceMappingURL=sourcemaps/Context.js.map
