"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DirLoader_1 = require("./loaders/DirLoader");
var ModuleLoader_1 = require("./loaders/ModuleLoader");
var DynamicLoader_1 = require("./loaders/DynamicLoader");
var CustomLoader_1 = require("./loaders/CustomLoader");
var _ = require("lodash");
var chalk = require("chalk");
/**
 * loader factory.
 *
 * @export
 * @class LoaderFactory
 * @implements {ILoaderFactory}
 */
var LoaderFactory = /** @class */ (function () {
    function LoaderFactory() {
    }
    /**
     * create loader via config in context.
     * @param context
     */
    LoaderFactory.prototype.create = function (context) {
        var option = context.option;
        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader_1.ModuleLoader(context);
        }
        else if (_.isFunction(option.loader)) {
            if (context.isTask(option.loader)) {
                option.loader = {
                    module: option.loader
                };
                return new ModuleLoader_1.ModuleLoader(context);
            }
            else {
                return new CustomLoader_1.CustomLoader(context, option.loader);
            }
        }
        else if (_.isArray(option.loader)) {
            option.loader = {
                dynamicTasks: option.loader || []
            };
            return new DynamicLoader_1.DynamicLoader(context);
        }
        else if (option.loader) {
            // if config dir.
            if (option.loader['dir']) {
                return new DirLoader_1.DirLoader(context);
            }
            // dynamic task name.
            if (_.isString(option.loader['name'])) {
                option.loader = {
                    dynamicTasks: option.loader
                };
                return new DynamicLoader_1.DynamicLoader(context);
            }
            // if config pipe and taskName.
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader_1.DynamicLoader(context);
            }
            var loader = null;
            var loderOption = option.loader;
            switch (loderOption.type) {
                case 'dir':
                    loader = new DirLoader_1.DirLoader(context);
                    break;
                case 'dynamic':
                    loader = new DynamicLoader_1.DynamicLoader(context);
                    break;
                case 'module':
                default:
                    loader = new ModuleLoader_1.ModuleLoader(context);
                    break;
            }
            return loader;
        }
        else {
            console.log(chalk.cyan(option.name), chalk.gray('loader not setting, use dynamic loader.'));
            option.loader = {
                dynamicTasks: []
            };
            return new DynamicLoader_1.DynamicLoader(context);
        }
    };
    return LoaderFactory;
}());
exports.LoaderFactory = LoaderFactory;

//# sourceMappingURL=sourcemaps/loaderFactory.js.map
