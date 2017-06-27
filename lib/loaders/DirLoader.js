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
var ModuleLoader_1 = require("./ModuleLoader");
var DirLoader = (function (_super) {
    __extends(DirLoader, _super);
    function DirLoader(ctx) {
        return _super.call(this, ctx) || this;
    }
    DirLoader.prototype.loadTasks = function (context, def) {
        var loader = this.option.loader;
        if (loader.dir) {
            return context.findTasksInDir(loader.dir);
        }
        else {
            return _super.prototype.loadTasks.call(this, context, def);
        }
    };
    DirLoader.prototype.loadTaskDefine = function () {
        var loader = this.option.loader;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return this.ctx.findTaskDefineInDir(loader.dir);
        }
        else {
            return _super.prototype.loadTaskDefine.call(this);
        }
    };
    return DirLoader;
}(ModuleLoader_1.ModuleLoader));
exports.DirLoader = DirLoader;

//# sourceMappingURL=../sourcemaps/loaders/DirLoader.js.map
