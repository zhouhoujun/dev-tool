import * as _ from 'lodash';
import * as path from 'path';
import { existsSync } from 'fs';

import { Task, Operation, TaskOption, TaskConfig, configBuilder } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';



export interface OperateTask {
    folder: string;
    main: string;
}
export interface Operates {

}

export class DirLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }

    load(oper: Operation): Promise<Task[]> {
        if (this.option.loader.dir) {
            return this.loadTaskFromDir(this.option.loader.dir);
        } else {
            return super.load(oper);
        }
    }

    protected getConfigModule(): any {
        return require(this.option.loader.configModule || this.option.loader.module);
    }

    getConfigBuild(): Promise<configBuilder> {
        if (this.option.loader.dir) {
            return Promise.race<TaskConfig>(_.map(this.option.loader.dir, dir => {
                return new Promise((resolve, reject) => {
                    let builder = this.getConfigBuilder();
                    if (builder) {
                        resolve(builder);
                    }
                });
            }));
        } else {
            return super.getConfigBuild();
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
        let cfn = option.loader.configModule || './config';
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
