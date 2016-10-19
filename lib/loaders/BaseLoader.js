"use strict";
const _ = require('lodash');
const requireDir = require('require-dir');
class BaseLoader {
    constructor(option) {
        this.option = option;
    }
    load(cfg) {
        return this.getTaskDefine()
            .then(def => {
            if (def.moduleTaskLoader) {
                return def.moduleTaskLoader(cfg, (mdl) => {
                    return this.loadTaskFromModule(mdl);
                }, (dirs) => {
                    return this.loadTaskFromDir(dirs);
                });
            }
            else {
                let mdl = this.getTaskModule();
                return this.loadTaskFromModule(mdl);
            }
        })
            .catch(err => {
            console.error(err);
        });
    }
    loadConfg(oper, env) {
        return this.getTaskDefine()
            .then(def => {
            return def.moduleTaskConfig(oper, this.option, env);
        })
            .catch(err => {
            console.error(err);
        });
    }
    getTaskDefine() {
        let tsdef = null;
        if (this.option.loader.taskDefine) {
            tsdef = this.option.loader.taskDefine;
        }
        if (!tsdef) {
            let mdl = this.getConfigModule();
            tsdef = this.findTaskDefine(mdl);
        }
        if (tsdef) {
            return Promise.resolve(tsdef);
        }
        else {
            return Promise.reject('can not found task define.');
        }
    }
    getConfigModule() {
        let ml = this.option.loader.configModule || this.option.loader.module;
        if (_.isString(ml)) {
            return require(ml);
        }
        else {
            return ml;
        }
    }
    getTaskModule() {
        let ml = this.option.loader.taskModule || this.option.loader.module;
        if (_.isString(ml)) {
            return require(ml);
        }
        else {
            return ml;
        }
    }
    findTaskDefine(mdl) {
        let def = null;
        if (this.isTaskDefine(mdl)) {
            def = mdl;
        }
        if (!def && mdl) {
            _.each(_.keys(mdl), f => {
                if (def) {
                    return false;
                }
                if (this.isTaskDefine(mdl[f])) {
                    def = mdl[f];
                }
                return true;
            });
        }
        return def;
    }
    isTaskDefine(mdl) {
        if (!mdl) {
            return false;
        }
        if (this.option.loader.isTaskDefine) {
            return this.option.loader.isTaskDefine(mdl);
        }
        return _.isFunction(mdl['moduleTaskConfig']);
    }
    isTaskFunc(mdl, exceptObj = false) {
        if (!mdl) {
            return false;
        }
        if (this.option.loader.isTaskFunc) {
            return this.option.loader.isTaskFunc(mdl);
        }
        if (_.isFunction(mdl)) {
            return true;
        }
        return exceptObj;
    }
    findTasks(mdl) {
        let tasks = [];
        if (!mdl) {
            return tasks;
        }
        if (this.isTaskFunc(mdl)) {
            tasks.push(mdl);
        }
        else if (!this.isTaskDefine(mdl)) {
            if (_.isArray(mdl)) {
                _.each(mdl, sm => {
                    tasks.concat(this.findTasks(sm));
                });
            }
            else {
                _.each(_.keys(mdl), key => {
                    console.log('register task from:', key);
                    tasks.concat(this.findTasks(mdl[key]));
                });
            }
        }
        return tasks;
    }
    loadTaskFromModule(mdl) {
        let taskfuns = this.findTasks(mdl);
        if (!taskfuns || taskfuns.length < 1) {
            return Promise.reject('has not found task in ModuleLoader.ts.');
        }
        else {
            return Promise.resolve(taskfuns);
        }
    }
    loadTaskFromDir(dirs) {
        return Promise.all(_.map(_.isArray(dirs) ? dirs : [dirs], dir => {
            console.log('begin load task from dir', dir);
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTaskFromModule(mdl);
        }))
            .then(tasks => {
            return _.flatten(tasks);
        });
    }
}
exports.BaseLoader = BaseLoader;
