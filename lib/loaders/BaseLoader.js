"use strict";
const _ = require('lodash');
const requireDir = require('require-dir');
const chalk = require('chalk');
class BaseLoader {
    constructor(option) {
        this.option = option;
    }
    load(cfg) {
        return this.getTaskDefine()
            .then(def => {
            if (def.moduleTaskLoader) {
                return def.moduleTaskLoader(cfg);
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
            .then(config => {
            return this.bindingConfig(config);
        })
            .catch(err => {
            console.error(err);
        });
    }
    bindingConfig(cfg) {
        cfg.findTasksInDir = cfg.findTasksInDir || ((dirs) => {
            return this.loadTaskFromDir(dirs);
        });
        cfg.findTasksInModule = cfg.findTasksInModule || ((mdl) => {
            return this.loadTaskFromModule(mdl);
        });
        return cfg;
    }
    getTaskDefine() {
        let tsdef = null;
        if (!_.isString(this.option.loader)) {
            if (this.option.loader.taskDefine) {
                tsdef = this.option.loader.taskDefine;
            }
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
        let ml;
        if (_.isString(this.option.loader)) {
            ml = this.option.loader;
        }
        else {
            ml = this.option.loader.configModule || this.option.loader.module;
        }
        if (_.isString(ml)) {
            return require(ml);
        }
        else {
            return ml;
        }
    }
    getTaskModule() {
        let ml;
        if (_.isString(this.option.loader)) {
            ml = this.option.loader;
        }
        else {
            ml = this.option.loader.taskModule || this.option.loader.module;
        }
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
        if (!_.isString(this.option.loader) && this.option.loader.isTaskDefine) {
            return this.option.loader.isTaskDefine(mdl);
        }
        return _.isFunction(mdl['moduleTaskConfig']);
    }
    isTaskFunc(mdl, exceptObj = false) {
        if (!mdl) {
            return false;
        }
        if (!_.isString(this.option.loader) && this.option.loader.isTaskFunc) {
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
                    console.log(chalk.grey('register task from:'), chalk.cyan(key));
                    tasks = tasks.concat(this.findTasks(mdl[key]));
                });
            }
        }
        return tasks;
    }
    loadTaskFromModule(mdl) {
        let taskfuns = this.findTasks(mdl);
        if (!taskfuns || taskfuns.length < 1) {
            console.log(chalk.red('error module:'), mdl);
            return Promise.reject('has not found task in module.');
        }
        else {
            return Promise.resolve(taskfuns);
        }
    }
    loadTaskFromDir(dirs) {
        return Promise.all(_.map(_.isArray(dirs) ? dirs : [dirs], dir => {
            console.log(chalk.grey('begin load task from dir'), chalk.cyan(dir));
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTaskFromModule(mdl);
        }))
            .then(tasks => {
            return _.flatten(tasks);
        });
    }
}
exports.BaseLoader = BaseLoader;

//# sourceMappingURL=../sourcemaps/loaders/BaseLoader.js.map
