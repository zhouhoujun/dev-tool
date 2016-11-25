"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DirLoader_1 = require('./loaders/DirLoader');
var ModuleLoader_1 = require('./loaders/ModuleLoader');
var DynamicLoader_1 = require('./loaders/DynamicLoader');
var CustomLoader_1 = require('./loaders/CustomLoader');
var _ = require('lodash');
var chalk = require('chalk');
/**
 * loader factory.
 *
 * @export
 * @class LoaderFactory
 * @implements {ILoaderFactory}
 */

var LoaderFactory = function () {
    function LoaderFactory() {
        _classCallCheck(this, LoaderFactory);
    }

    _createClass(LoaderFactory, [{
        key: 'create',
        value: function create(option, env, factory) {
            if (_.isString(option.loader)) {
                option.loader = {
                    module: option.loader
                };
                return new ModuleLoader_1.ModuleLoader(option, env, factory);
            } else if (_.isFunction(option.loader)) {
                return new CustomLoader_1.CustomLoader(option, option.loader, factory);
            } else if (_.isArray(option.loader)) {
                option.loader = {
                    dynamicTasks: option.loader || []
                };
                return new DynamicLoader_1.DynamicLoader(option, env, factory);
            } else if (option.loader) {
                // if config dir.
                if (option.loader['dir']) {
                    return new DirLoader_1.DirLoader(option, env);
                }
                // dynamic task name.
                if (_.isString(option.loader['name'])) {
                    option.loader = {
                        dynamicTasks: option.loader
                    };
                    return new DynamicLoader_1.DynamicLoader(option, env, factory);
                }
                // if config pipe and taskName.
                if (option.loader['dynamicTasks']) {
                    return new DynamicLoader_1.DynamicLoader(option);
                }
                var loader = null;
                var loderOption = option.loader;
                switch (loderOption.type) {
                    case 'dir':
                        loader = new DirLoader_1.DirLoader(option, env, factory);
                        break;
                    case 'dynamic':
                        loader = new DynamicLoader_1.DynamicLoader(option, env, factory);
                        break;
                    case 'module':
                    default:
                        loader = new ModuleLoader_1.ModuleLoader(option, env, factory);
                        break;
                }
                return loader;
            } else {
                console.log(chalk.cyan(option.name), chalk.yellow('loader not setting, use dynamic loader.'));
                option.loader = {
                    dynamicTasks: []
                };
                return new DynamicLoader_1.DynamicLoader(option, env, factory);
            }
        }
    }]);

    return LoaderFactory;
}();

exports.LoaderFactory = LoaderFactory;
//# sourceMappingURL=sourcemaps/loaderFactory.js.map