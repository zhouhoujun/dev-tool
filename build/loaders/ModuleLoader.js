"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var development_core_1 = require("development-core");
var BaseLoader_1 = require("./BaseLoader");
var contextDefine_1 = require("../utils/contextDefine");
var chalk = require("chalk");
var ModuleLoader = (function (_super) {
    __extends(ModuleLoader, _super);
    function ModuleLoader(option, env, factory) {
        return _super.call(this, option, env, factory) || this;
    }
    ModuleLoader.prototype.getContextDefine = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var loader = _this.option.loader;
            if (loader) {
                if (loader.contextDefine) {
                    resolve(loader.contextDefine);
                }
                else if (loader.taskDefine) {
                    resolve(development_core_1.taskDefine2Context(loader.taskDefine));
                }
                else {
                    var mdl = _this.getConfigModule();
                    development_core_1.findTaskDefineInModule(mdl)
                        .then(function (def) {
                        if (def) {
                            resolve(def);
                        }
                        else {
                            resolve(contextDefine_1.default(_this.getTaskModule()));
                        }
                    })
                        .catch(function (err) {
                        console.error(chalk.red(err));
                        resolve(contextDefine_1.default(_this.getTaskModule()));
                    });
                }
            }
            else {
                reject('loader not found.');
            }
        });
    };
    return ModuleLoader;
}(BaseLoader_1.BaseLoader));
exports.ModuleLoader = ModuleLoader;

//# sourceMappingURL=../sourcemaps/loaders/ModuleLoader.js.map
