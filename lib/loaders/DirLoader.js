"use strict";
const _ = require('lodash');
const path = require('path');
const fs_1 = require('fs');
const BaseLoader_1 = require('./BaseLoader');
class DirLoader extends BaseLoader_1.BaseLoader {
    constructor(option) {
        super(option);
    }
    load(oper) {
        let loader = this.option.loader;
        if (loader.dir) {
            return this.loadTaskFromDir(loader.dir);
        }
        else {
            return super.load(oper);
        }
    }
    getConfigBuild() {
        let loader = this.option.loader;
        if (!loader.moduleTaskConfig
            && !loader.module && loader.dir) {
            return Promise.race(_.map(loader.dir, dir => {
                return new Promise((resolve, reject) => {
                    let mdl = this.getDirConfigModule(loader, dir);
                    if (mdl) {
                        let builder = this.findMethod(mdl, loader.dirConfigBuilderName || this.taskLoaderMethods);
                        if (builder) {
                            resolve(builder);
                        }
                    }
                });
            }));
        }
        else {
            return super.getConfigBuild();
        }
    }
    getDirConfigModule(loader, dir) {
        let cfn = loader.dirConfigFile || './config';
        let fpath = path.join(dir, cfn);
        if (/.\S[1,]$/.test(fpath)) {
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
