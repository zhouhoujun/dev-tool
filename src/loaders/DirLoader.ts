import * as _ from 'lodash';
import * as path from 'path';
import { existsSync } from 'fs';

import { Task, Operation, TaskOption, TaskConfig } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';

const requireDir = require('require-dir');

export interface OperateTask {
    folder: string;
    main: string;
}
export interface Operates {

}

export class DirLoader implements ITaskLoader {

    constructor(private taskDirs: string[]) {

    }
    load(oper: Operation): Promise<Task[]> {
        return Promise.all(_.map(this.taskDirs, dir => {
            console.log('begin load task from', dir);
            let tasks = requireDir(dir, { recurse: true });

            // console.log(tasks);
            let taskfuns: Task[] = [];
            _.each(_.keys(tasks), (key: string) => {
                console.log('register task from:', key);
                if (key === 'task-config') {
                    return;
                }

                let taskMdl = tasks[key];
                if (_.isFunction(taskMdl)) {
                    taskfuns.push(taskMdl);
                } else if (taskMdl) {
                    _.each(_.keys(taskMdl), k => {
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
            })
        }))
            .then(tasks => {
                return _.flatten(tasks);
            });
    }

    loadConfg(oper: Operation, option: TaskOption): Promise<TaskConfig> {
        if (option.loader.taskConfig) {
            if (_.isFunction(option.loader.taskConfig)) {
                let tsfac = option.loader.taskConfig();
                return Promise.resolve(tsfac(oper));
            } else if (_.isString(option.loader.taskConfig)) {
                let confmdl = require(option.loader.taskConfig);
                return Promise.resolve(this.execFunc(confmdl, oper, option))
                    .then(tscf => {
                        return <TaskConfig>tscf;
                    });
            } else {
                return Promise.reject('task config error.');
            }
        } else {
            return Promise.race<TaskConfig>(_.map(this.taskDirs, dir => {
                return new Promise((resolve, reject) => {
                    let builder = this.getConfigBuilder(oper, option, dir);
                    if (!builder) {
                        return null;
                    }
                    let config = <TaskConfig>this.execFunc(builder, oper, option);
                    if (config) {
                        resolve(config);
                    }
                });
            }));
        }
    }

    execFunc(mdl: any, param1?: any, param2?: any, param3?: any, param4?: any, param5?: any): any {
        if (!mdl) {
            return null;
        }
        if (_.isFunction(mdl)) {
            return mdl(param1, param2, param3, param4, param5);
        } else if (_.isFunction(mdl.default)) {
            return mdl.default(param1, param2, param3, param4, param5);
        }
    }

    private getConfigBuilder(oper: Operation, option: TaskOption, dir: string) {
        let cfn = option.loader.taskConfigFileName || './config';
        let fpath = path.join(dir, cfn);
        if (/.\S[1,]$/.test(fpath)) {
            return require(fpath);
        } else if (existsSync(fpath + '.js')) {
            return require(fpath + '.js');
        } else if (existsSync(fpath + '.ts')) {
            return require(fpath + '.ts')
        }
    }
}
