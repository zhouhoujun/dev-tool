"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var development_core_1 = require("development-core");
var ModuleLoader_1 = require("./ModuleLoader");
var DirLoader = (function (_super) {
    __extends(DirLoader, _super);
    function DirLoader(option, env, factory) {
        return _super.call(this, option, env) || this;
    }
    DirLoader.prototype.loadTasks = function (context, def) {
        var loader = this.option.loader;
        if (loader.dir) {
            return context.findTasksInDir(development_core_1.taskSourceVal(loader.dir, context));
        }
        else {
            return _super.prototype.loadTasks.call(this, context, def);
        }
    };
    DirLoader.prototype.getContextDefine = function () {
        var loader = this.option.loader;
        var self = this;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return development_core_1.findTaskDefineInDir(development_core_1.taskSourceVal(loader.dir, development_core_1.bindingConfig({ env: self.env, option: {}, createContext: self.factory })));
        }
        else {
            return _super.prototype.getContextDefine.call(this);
        }
    };
    return DirLoader;
}(ModuleLoader_1.ModuleLoader));
exports.DirLoader = DirLoader;

//# sourceMappingURL=../sourcemaps/loaders/DirLoader.js.map
