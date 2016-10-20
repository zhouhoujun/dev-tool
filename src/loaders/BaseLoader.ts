import * as _ from 'lodash';
import { Src, Task, EnvOption, Operation, TaskOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
const requireDir = require('require-dir');
import { isAbsolute } from 'path';

export abstract class BaseLoader implements ITaskLoader {

    protected option: TaskOption;
    constructor(option: TaskOption) {
        this.option = option;
    }

    load(cfg: TaskConfig): Promise<Task[]> {
        return this.getTaskDefine()
            .then(def => {
                if (def.moduleTaskLoader) {
                    return def.moduleTaskLoader(
                        cfg,
                        (mdl) => {
                            return this.loadTaskFromModule(mdl);
                        },
                        (dirs) => {
                            return this.loadTaskFromDir(dirs)
                        });
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
            .catch(err => {
                console.error(err);
            });
    }

    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        if (this.option.loader.taskDefine) {
            tsdef = this.option.loader.taskDefine;
        }
        if (!tsdef) {
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
        let ml = this.option.loader.configModule || this.option.loader.module;
        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

    protected getTaskModule(): any {
        let ml = this.option.loader.taskModule || this.option.loader.module;
        if (_.isString(ml)) {
            return require(ml);
        } else {
            return ml;
        }
    }

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
        if (this.option.loader.isTaskDefine) {
            return this.option.loader.isTaskDefine(mdl);
        }
        return _.isFunction(mdl['moduleTaskConfig']);
    }

    protected isTaskFunc(mdl: any, exceptObj = false): boolean {
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
                    console.log('register task from:', key);
                    tasks = tasks.concat(this.findTasks(mdl[key]));
                });
            }
        }
        return tasks;
    }

    protected loadTaskFromModule(mdl: any): Promise<Task[]> {
        let taskfuns: Task[] = this.findTasks(mdl);
        if (!taskfuns || taskfuns.length < 1) {
            console.log('error module:', mdl);
            return Promise.reject('has not found task in module.');
        } else {
            return Promise.resolve(taskfuns);
        }
    }

    protected loadTaskFromDir(dirs: Src): Promise<Task[]> {
        return Promise.all(_.map(_.isArray(dirs) ? <string[]>dirs : [<string>dirs], dir => {
            console.log('begin load task from dir', dir);
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTaskFromModule(mdl);
        }))
            .then(tasks => {
                return _.flatten(tasks);
            });
    }



    // protected findMethod(mdl: any, methods: Src) {
    //     if (!mdl) {
    //         return null;
    //     }
    //     let func = null;
    //     _.each(_.isArray(methods) ? <string[]>methods : [<string>methods], f => {
    //         if (func) {
    //             return false;
    //         }
    //         if (!f && _.isFunction(mdl)) {
    //             func = mdl;
    //         } else if (f && _.isFunction(mdl[f])) {
    //             func = mdl;
    //         }
    //         return true;
    //     });
    //     return func;
    // }
}
