"use strict";
const _ = require('lodash');
const requireDir = require('require-dir');
class BaseLoader {
    constructor(option) {
        this.configMethods = [
            'moduleTaskConfig',
            'default'
        ];
        this.taskLoaderMethods = [
            'moduleTaskLoader',
            'defualt'
        ];
        this.option = option;
    }
    getConfigBuild() {
        let method, builder = null;
        if (this.option.loader.moduleTaskConfig) {
            if (_.isFunction(this.option.loader.moduleTaskConfig)) {
                builder = this.option.loader.moduleTaskConfig;
            }
            else if (_.isString(this.option.loader.moduleTaskConfig)) {
                method = this.option.loader.moduleTaskConfig;
            }
        }
        if (!builder) {
            let mdl = this.getConfigModule();
            let func = this.findMethod(mdl, method || this.configMethods);
            if (func) {
                builder = (oper, option) => {
                    return func.call(mdl, oper, option);
                };
            }
            else {
                console.error('can not found task config builder method in module {0}.', mdl);
                return Promise.reject('can not found task config builder method in module');
            }
        }
        return Promise.resolve(builder);
    }
    getConfigModule() {
        return require(this.option.loader.configModule || this.option.loader.module);
    }
    getModuleTaskLoader() {
        let method, loader = null;
        if (this.option.loader.moduleTaskloader) {
            if (_.isFunction(this.option.loader.moduleTaskloader)) {
                loader = this.option.loader.moduleTaskloader;
            }
            else if (_.isString(this.option.loader.moduleTaskloader)) {
                method = this.option.loader.moduleTaskloader;
            }
        }
        if (!loader) {
            let mdl = this.getTaskModule();
            let func = this.findMethod(mdl, method || this.taskLoaderMethods);
            if (func) {
                loader = (oper, option) => {
                    return func.call(mdl, oper, option, this.loadTaskFromDir);
                };
            }
            else {
                loader = (oper, option) => {
                    return this.loadTask(mdl);
                };
            }
        }
        return Promise.resolve(loader);
    }
    getTaskModule() {
        return require(this.option.loader.taskModule || this.option.loader.module);
    }
    loadTask(mdl) {
        let taskfuns = [];
        if (!mdl) {
            return taskfuns;
        }
        let tasks = mdl;
        _.each(_.keys(tasks), (key) => {
            console.log('register task from:', key);
            if (!this.isTaskFunc(key)) {
                return;
            }
            let taskMdl = tasks[key];
            if (_.isFunction(taskMdl)) {
                taskfuns.push(taskMdl);
            }
            else if (taskMdl) {
                _.each(_.keys(taskMdl), k => {
                    if (!this.isTaskFunc(key)) {
                        return;
                    }
                    let subMdl = taskMdl[k];
                    if (_.isArray(subMdl)) {
                        _.each(subMdl, r => {
                            if (_.isFunction(r)) {
                                taskfuns.push(r);
                            }
                        });
                    }
                    else if (_.isFunction(subMdl)) {
                        taskfuns.push(subMdl);
                    }
                });
            }
        });
        return taskfuns;
    }
    isTaskFunc(name) {
        let flag = true;
        if (_.isString(this.option.loader.moduleTaskConfig)) {
            flag = name !== this.option.loader.moduleTaskConfig;
        }
        if (_.isString(this.option.loader.moduleTaskloader)) {
            flag = flag && name !== this.option.loader.moduleTaskloader;
        }
        flag = flag
            && (!_.some(this.configMethods, it => it === name))
            && (!_.some(this.taskLoaderMethods, it => it === name));
        if (this.option.loader.isTaskFunc) {
            flag = flag && this.option.loader.isTaskFunc(name);
        }
        return flag;
    }
    loadTaskFromDir(dirs) {
        return Promise.all(_.map(_.isArray(dirs) ? dirs : [dirs], dir => {
            console.log('begin load task from', dir);
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTask(mdl);
        }))
            .then(tasks => {
            return _.flatten(tasks);
        });
    }
    load(oper) {
        return this.getModuleTaskLoader()
            .then(load => {
            return load(oper, this.option);
        })
            .catch(err => {
            console.error(err);
        });
    }
    loadConfg(oper) {
        return this.getConfigBuild()
            .then(builder => {
            return builder(oper, this.option);
        })
            .catch(err => {
            console.error(err);
        });
    }
    findMethod(mdl, methods) {
        if (!mdl) {
            return null;
        }
        let func = null;
        _.each(_.isArray(methods) ? methods : [methods], f => {
            if (func) {
                return false;
            }
            if (!f && _.isFunction(mdl)) {
                func = mdl;
            }
            else if (f && _.isFunction(mdl[f])) {
                func = mdl;
            }
            return true;
        });
        return func;
    }
}
exports.BaseLoader = BaseLoader;
