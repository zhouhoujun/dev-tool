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
var BaseLoader_1 = require("./BaseLoader");
var taskDefine_1 = require("../utils/taskDefine");
var chalk = require("chalk");
/**
 * load task from module or npm package.
 *
 * @export
 * @class ModuleLoader
 * @extends {BaseLoader}
 */
var ModuleLoader = (function (_super) {
    __extends(ModuleLoader, _super);
    function ModuleLoader(ctx) {
        var _this = _super.call(this, ctx) || this;
        _this.name = 'module';
        return _this;
    }
    ModuleLoader.prototype.loadTaskDefine = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var loader = _this.option.loader;
            if (loader) {
                if (loader.taskDefine) {
                    resolve(loader.taskDefine);
                }
                else {
                    var mdl = _this.getConfigModule();
                    _this.ctx.findTaskDefine(mdl)
                        .then(function (def) {
                        if (def) {
                            resolve(def);
                        }
                        else {
                            resolve(taskDefine_1.default(_this.getTaskModule()));
                        }
                    })
                        .catch(function (err) {
                        console.error(chalk.red(err));
                        resolve(taskDefine_1.default(_this.getTaskModule()));
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
