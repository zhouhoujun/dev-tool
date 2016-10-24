"use strict";
const _ = require('lodash');
const path = require('path');
const fs_1 = require('fs');
const BaseLoader_1 = require('./BaseLoader');
class DirLoader extends BaseLoader_1.BaseLoader {
    constructor(option) {
        super(option);
    }
    load(cfg) {
        let loader = this.option.loader;
        if (loader.dir) {
            return this.loadTaskFromDir(loader.dir);
        }
        else {
            return super.load(cfg);
        }
    }
    getTaskDefine() {
        let loader = this.option.loader;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return Promise.race(_.map(loader.dir, dir => {
                return new Promise((resolve, reject) => {
                    let mdl = this.getDirConfigModule(loader, dir);
                    if (mdl) {
                        let def = this.findTaskDefine(mdl);
                        if (def) {
                            resolve(def);
                        }
                    }
                });
            }));
        }
        else {
            return super.getTaskDefine();
        }
    }
    getDirConfigModule(loader, dir) {
        let cfn = loader.dirConfigFile || './config';
        let fpath = path.join(dir, cfn);
        if (/.\S+$/.test(fpath)) {
            return require(fpath);
        }
        else if (fs_1.existsSync(fpath + '.js')) {
            return require(fpath + '.js');
        }
        else if (fs_1.existsSync(fpath + '.ts')) {
            return require(fpath + '.ts');
        }
    }
}
exports.DirLoader = DirLoader;

//# sourceMappingURL=../sourcemaps/loaders/DirLoader.js.map
