import * as _ from 'lodash';
import { Task, Operation, TaskOption, TaskConfig, moduleTaskLoader, configBuilder } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
const requireDir = require('require-dir');

export abstract class BaseLoader implements ITaskLoader {

    protected option: TaskOption;
    constructor(option: TaskOption) {
        this.option = option;
    }

    protected getConfigBuild(): Promise<configBuilder> {
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
            let func = this.findMethod(mdl, method || this.configMethods);
            if (func) {
                builder = (oper: Operation, option) => {
                    return func.call(mdl, oper, option);
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
        let method: string, loader = null;
        if (this.option.loader.moduleTaskloader) {
            if (_.isFunction(this.option.loader.moduleTaskloader)) {
                loader = this.option.loader.moduleTaskloader;
            } else if (_.isString(this.option.loader.moduleTaskloader)) {
                method = this.option.loader.moduleTaskloader;
            }
        }
        if (!loader) {

            let mdl = this.getTaskModule();
            let func = <moduleTaskLoader>this.findMethod(mdl, method || this.taskLoaderMethods);
            if (func) {
                loader = (oper: Operation, option: TaskOption) => {
                    return func.call(mdl, oper, option, this.loadTaskFromDir);
                };
            } else {
                loader = (oper: Operation, option: TaskOption) => {
                    return this.loadTask(mdl);
                };
            }
        }
        return Promise.resolve(loader);
    }

    protected getTaskModule(): any {
        return require(this.option.loader.taskModule || this.option.loader.module);
    }


    protected loadTask(mdl: any) {
        let taskfuns: Task[] = [];
        if (!mdl) {
            return taskfuns;
        }
        let tasks = mdl;
        _.each(_.keys(tasks), (key: string) => {
            console.log('register task from:', key);
            if (!this.isTaskFunc(key)) {
                return;
            }

            let taskMdl = tasks[key];
            if (_.isFunction(taskMdl)) {
                taskfuns.push(taskMdl);
            } else if (taskMdl) {
                _.each(_.keys(taskMdl), k => {
                    if (!this.isTaskFunc(key)) {
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
        return taskfuns;
    }

    protected isTaskFunc(name: string): boolean {
        let flag = true;
        if (_.isString(this.option.loader.moduleTaskConfig)) {
            flag = name !== this.option.loader.moduleTaskConfig;
        }

        if (_.isString(this.option.loader.moduleTaskloader)) {
            flag = flag && name !== this.option.loader.moduleTaskloader;
        }

        flag = flag
            && (!_.some(this.configMethods, it => it === name))
            && (!_.some(this.taskLoaderMethods, it => it === name))

        if (this.option.loader.isTaskFunc) {
            flag = flag && this.option.loader.isTaskFunc(name);
        }

        return flag;

    }

    protected loadTaskFromDir(dirs: string | string[]): Promise<Task[]> {
        return Promise.all(_.map(_.isArray(dirs) ? <string[]>dirs : [<string>dirs], dir => {
            console.log('begin load task from', dir);
            let mdl = requireDir(dir, { recurse: true });
            return this.loadTask(mdl);
        }))
            .then(tasks => {
                return _.flatten(tasks);
            });
    }



    public configMethods: string[] = [
        'moduleTaskConfig',
        'default'
    ];

    public taskLoaderMethods: string[] = [
        'moduleTaskLoader',
        'defualt'
    ];

    load(oper: Operation): Promise<Task[]> {
        return this.getModuleTaskLoader()
            .then(load => {
                return load(oper, this.option);
            })
            .catch(err => {
                console.error(err);
            });
    }

    loadConfg(oper: Operation): Promise<TaskConfig> {
        return this.getConfigBuild()
            .then(builder => {
                return builder(oper, this.option);
            })
            .catch(err => {
                console.error(err);
            });
    }

    protected findMethod(mdl: any, methods: string | string[]) {
        if (!mdl) {
            return null;
        }
        let func = null;
        _.each(_.isArray(methods) ? <string[]>methods : [<string>methods], f => {
            if (func) {
                return false;
            }
            if (!f && _.isFunction(mdl)) {
                func = mdl;
            } else if (f && _.isFunction(mdl[f])) {
                func = mdl;
            }
            return true;
        });
        return func;
    }
}
