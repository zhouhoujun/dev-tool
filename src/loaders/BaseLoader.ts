import * as _ from 'lodash';
import { Src, Task, EnvOption, Operation, TaskOption, TaskConfig, ITaskDefine, moduleTaskLoader, moduleTaskConfig } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
const requireDir = require('require-dir');

export abstract class BaseLoader implements ITaskLoader {

    protected option: TaskOption;
    constructor(option: TaskOption) {
        this.option = option;
    }

    load(oper: Operation): Promise<Task[]> {
        return this.getModuleTaskLoader()
            .then(load => {
                return load(
                    oper,
                    this.option,
                    (mdl) => {
                        return this.loadTaskFromModule(mdl);
                    },
                    (dirs) => {
                        return this.loadTaskFromDir(dirs)
                    });
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig> {
        return this.getConfigBuild()
            .then(builder => {
                return builder(oper, this.option, env);
            })
            .catch(err => {
                console.error(err);
            });
    }

    protected getConfigBuild(): Promise<moduleTaskConfig> {
        let method: string, builder = null;
        if (this.option.loader.moduleTaskConfig) {
            if (_.isFunction(this.option.loader.moduleTaskConfig)) {
                builder = this.option.loader.moduleTaskConfig;
            } else if (_.isString(this.option.loader.moduleTaskConfig)) {
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
            } else {
                console.error('can not found task config builder method in module {0}.', mdl);
                return Promise.reject('can not found task config builder method in module');
            }
        }

        return Promise.resolve(builder);
    }

    protected getConfigModule(): any {
        return require(this.option.loader.configModule || this.option.loader.module);
    }

    protected getModuleTaskLoader(): Promise<moduleTaskLoader> {
        let loader: moduleTaskLoader = null;
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
                    return tdef.moduleTaskLoader(
                        oper,
                        option,
                        (mdl) => {
                            return this.loadTaskFromModule(mdl);
                        },
                        (dirs) => {
                            return this.loadTaskFromDir(dirs)
                        });
                };
            } else {
                loader = (oper, option) => {
                    return this.loadTaskFromModule(mdl);
                };
            }
        }
        return Promise.resolve(loader);
    }

    protected getTaskModule(): any {
        return require(this.option.loader.taskModule || this.option.loader.module);
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

    protected isTaskFunc(mdl: any, name: string): boolean {
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

    protected loadTaskFromModule(mdl: any): Promise<Task[]> {
        let taskfuns: Task[] = [];
        if (!mdl) {
            return Promise.reject('module is un');
        }
        let tasks = mdl;
        _.each(_.keys(tasks), (key: string) => {
            console.log('register task from:', key);
            if (!this.isTaskFunc(tasks, key)) {
                return;
            }

            let taskMdl = tasks[key];
            if (_.isFunction(taskMdl)) {
                taskfuns.push(taskMdl);
            } else if (taskMdl) {
                _.each(_.keys(taskMdl), k => {
                    if (!this.isTaskFunc(taskMdl, key)) {
                        return;
                    }
                    let subMdl = taskMdl[k];
                    if (_.isArray(subMdl)) {
                        _.each(<Task[]>subMdl, r => {
                            if (_.isFunction(r)) {
                                taskfuns.push(r);
                            }
                        });
                    } else if (_.isFunction(subMdl)) {
                        taskfuns.push(subMdl);
                    }
                });
            }
        });
        return Promise.resolve(taskfuns);
    }

    protected loadTaskFromDir(dirs: Src): Promise<Task[]> {
        return Promise.all(_.map(_.isArray(dirs) ? <string[]>dirs : [<string>dirs], dir => {
            console.log('begin load task from', dir);
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
