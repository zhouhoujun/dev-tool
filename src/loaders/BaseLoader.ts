import * as _ from 'lodash';
import { Src, Task, EnvOption, Operation, TaskOption, LoaderOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
const requireDir = require('require-dir');
import * as chalk from 'chalk';
// import { isAbsolute } from 'path';

export abstract class BaseLoader implements ITaskLoader {

    protected option: TaskOption;
    constructor(option: TaskOption) {
        this.option = option;
    }

    load(cfg: TaskConfig): Promise<Task[]> {
        return this.getTaskDefine()
            .then(def => {
                if (def.moduleTaskLoader) {
                    return def.moduleTaskLoader(cfg);
                } else {
                    let mdl = this.getTaskModule();
                    return this.loadTaskFromModule(mdl);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig> {

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

    protected bindingConfig(cfg: TaskConfig): TaskConfig {
        cfg.findTasksInDir = cfg.findTasksInDir || ((dirs) => {
            return this.loadTaskFromDir(dirs);
        });
        cfg.findTasksInModule = cfg.findTasksInModule || ((mdl) => {
            return this.loadTaskFromModule(mdl);
        });
        return cfg;
    }

    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        let loader: LoaderOption = this.option.loader;

        if (loader.taskDefine) {
            tsdef = loader.taskDefine;
        } else {
            let mdl = this.getConfigModule();
            tsdef = this.findTaskDefine(mdl);
        }

        if (tsdef) {
            return Promise.resolve(tsdef);
        } else {
            // console.error('can not found task config builder method in module {0}.', mdl);
            return Promise.reject('can not found task define.');
        }
    }

    protected getConfigModule(): any {

        let loader: LoaderOption = this.option.loader;
        let ml = loader.configModule || loader.module;

        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

    protected getTaskModule(): any {

        let loader: LoaderOption = this.option.loader;
        let ml = loader.taskModule || loader.module;

        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

    /**
     * find task by reflect-metadata mark @taskDefine.
     * not vailable now.
     * @protected
     * @param {*} mdl
     * @returns {ITaskDefine}
     * 
     * @memberOf BaseLoader
     */
    protected findTaskDefine(mdl: any): ITaskDefine {
        let def: ITaskDefine = null;
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

    private isTaskDefine(mdl: any): boolean {
        if (!mdl) {
            return false;
        }
        let loader: LoaderOption = this.option.loader;
        if (loader.isTaskDefine) {
            return loader.isTaskDefine(mdl);
        }
        return _.isFunction(mdl['moduleTaskConfig']);
    }

    protected isTaskFunc(mdl: any, exceptObj = false): boolean {
        if (!mdl) {
            return false;
        }
        let loader: LoaderOption = this.option.loader;
        if (loader.isTaskFunc) {
            return loader.isTaskFunc(mdl);
        }

        if (_.isFunction(mdl)) {
            return true;
        }

        return exceptObj;
    }

    /**
     * find task by reflect-metadata mark @task.
     * not vailable now.
     * 
     * @private
     * @param {*} mdl
     * @returns {Task[]}
     * 
     * @memberOf BaseLoader
     */
    private findTasks(mdl: any): Task[] {
        let tasks = [];
        if (!mdl) {
            return tasks;
        }
        if (this.isTaskFunc(mdl)) {
            tasks.push(mdl);
        } else if (!this.isTaskDefine(mdl)) {
            if (_.isArray(mdl)) {
                _.each(mdl, sm => {
                    tasks.concat(this.findTasks(sm));
                });
            } else {
                _.each(_.keys(mdl), key => {
                    if (!key || !mdl[key] || /^[0-9]+$/.test(key)) {
                        return;
                    }
                    console.log(chalk.grey('register task from :'), chalk.cyan(key));
                    tasks = tasks.concat(this.findTasks(mdl[key]));
                });
            }
        }
        return tasks;
    }

    protected loadTaskFromModule(mdl: any): Promise<Task[]> {
        let taskfuns: Task[] = this.findTasks(mdl);
        return Promise.resolve(taskfuns);
    }

    protected loadTaskFromDir(dirs: Src): Promise<Task[]> {
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
