"use strict";
const DirLoader_1 = require('./loaders/DirLoader');
const ModuleLoader_1 = require('./loaders/ModuleLoader');
const DynamicLoader_1 = require('./loaders/DynamicLoader');
const _ = require('lodash');
class LoaderFactory {
    constructor() {
    }
    create(option) {
        if (_.isString(option.loader)) {
            option.loader = {
                module: option.loader
            };
            return new ModuleLoader_1.ModuleLoader(option);
        }
        else if (_.isArray(option.loader)) {
            option.loader = {
                dynamicTasks: option.loader
            };
            return new DynamicLoader_1.DynamicLoader(option);
        }
        else {
            if (option.loader['dir']) {
                return new DirLoader_1.DirLoader(option);
            }
            if (_.isString(option.loader['name'])) {
                option.loader = {
                    dynamicTasks: option.loader
                };
                return new DynamicLoader_1.DynamicLoader(option);
            }
            if (option.loader['dynamicTasks']) {
                return new DynamicLoader_1.DynamicLoader(option);
            }
            let loader = null;
            let loderOption = option.loader;
            switch (loderOption.type) {
                case 'dir':
                    loader = new DirLoader_1.DirLoader(option);
                    break;
                case 'dynamic':
                    loader = new DynamicLoader_1.DynamicLoader(option);
                    break;
                case 'module':
                default:
                    loader = new ModuleLoader_1.ModuleLoader(option);
                    break;
            }
            return loader;
        }
    }
}
exports.LoaderFactory = LoaderFactory;

//# sourceMappingURL=sourcemaps/loaderFactory.js.map
