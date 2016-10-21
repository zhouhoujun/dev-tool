"use strict";
const DirLoader_1 = require('./loaders/DirLoader');
const ModuleLoader_1 = require('./loaders/ModuleLoader');
class LoaderFactory {
    constructor() {
    }
    create(option) {
        let loader = null;
        switch (option.loader.type) {
            case 'dir':
                loader = new DirLoader_1.DirLoader(option);
                break;
            case 'module':
            default:
                loader = new ModuleLoader_1.ModuleLoader(option);
                break;
        }
        return loader;
    }
}
exports.LoaderFactory = LoaderFactory;
