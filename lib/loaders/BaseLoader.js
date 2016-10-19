"use strict";
const _ = require('lodash');
const requireDir = require('require-dir');
class BaseLoader {
    constructor(option) {
        this.option = option;
    }
    load(oper) {
        return this.getModuleTaskLoader()
            .then(load => {
            return load(oper, this.option, (mdl) => {
                return this.loadTaskFromModule(mdl);
            }, (dirs) => {
                return this.loadTaskFromDir(dirs);
            });
        })
            .catch(err => {
            console.error(err);
        });
    }
    loadConfg(oper, env) {
        return this.getConfigBuild()
            .then(builder => {
            return builder(oper, this.option, env);
        })
            .catch(err => {
            console.error(err);
        });
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
            let tdef = this.findTaskDefine(mdl);
            if (tdef) {
                builder = (oper, option, env) => {
                    return tdef.moduleTaskConfig(oper, option, env);
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
        let loader = null;
        if (this.option.loader.moduleTaskloader) {
            if (_.isFunction(this.option.loader.moduleTaskloader)) {
                loader = this.option.loader.moduleTaskloader;
            }
        }
        if (!loader) {
            let mdl = this.getTaskModule();
            let tdef = this.findTaskDefine(mdl);
            if (tdef && tdef.moduleTaskLoader) {
                loader = (oper, option) => {
                    return tdef.moduleTaskLoader(oper, option, (mdl) => {
                        return this.loadTaskFromModule(mdl);
                    }, (dirs) => {
                        return this.loadTaskFromDir(dirs);
                    });
                };
            }
            else {
                loader = (oper, option) => {
                    return this.loadTaskFromModule(mdl);
                };
            }
        }
        return Promise.resolve(loader);
    }
    getTaskModule() {
        return require(this.option.loader.taskModule || this.option.loader.module);
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
    isTaskFunc(mdl, name) {
        if (!mdl) {
            return false;
        }
        let field = mdl[name];
        if (!field) {
            return false;
        }
        if (this.option.loader.isTaskFunc) {
            return this.option.loader.isTaskFunc(mdl, name);
        }
        let flag = true;
        if (_.isString(this.option.loader.moduleTaskConfig)) {
            flag = name !== this.option.loader.moduleTaskConfig;
        }
        if (flag && _.isString(this.option.loader.moduleTaskloader)) {
            flag = name !== this.option.loader.moduleTaskloader;
        }
        if (flag && _.isFunction(field['moduleTaskloader']) && _.isFunction(field['moduleTaskConfig'])) {
            flag = false;
        }
        return flag;
    }
    loadTaskFromModule(mdl) {
        let taskfuns = [];
        if (!mdl) {
            return Promise.reject('module is un');
        }
        let tasks = mdl;
        _.each(_.keys(tasks), (key) => {
            console.log('register task from:', key);
            if (!this.isTaskFunc(tasks, key)) {
                return;
            }
            let taskMdl = tasks[key];
            if (_.isFunction(taskMdl)) {
                taskfuns.push(taskMdl);
            }
            else if (taskMdl) {
                _.each(_.keys(taskMdl), k => {
                    if (!this.isTaskFunc(taskMdl, key)) {
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
        return Promise.resolve(taskfuns);
    }
    loadTaskFromDir(dirs) {
        return Promise.all(_.map(_.isArray(dirs) ? dirs : [dirs], dir => {
            console.log('begin load task from', dir);
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTaskFromModule(mdl);
        }))
            .then(tasks => {
            return _.flatten(tasks);
        });
    }
}
exports.BaseLoader = BaseLoader;
