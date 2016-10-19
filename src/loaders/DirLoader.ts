import * as _ from 'lodash';
import * as path from 'path';
import { existsSync } from 'fs';
import { Task, Operation, DirLoaderOption, TaskOption, TaskConfig, moduleTaskConfig } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

export class DirLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }

    load(oper: Operation): Promise<Task[]> {
        let loader: DirLoaderOption = this.option.loader;
        if (loader.dir) {
            return this.loadTaskFromDir(loader.dir);
        } else {
            return super.load(oper);
        }
    }

    protected getConfigBuild(): Promise<moduleTaskConfig> {
        let loader: DirLoaderOption = this.option.loader;
        if (!loader.moduleTaskConfig
            && !loader.module && loader.dir) {
            return Promise.race<TaskConfig>(_.map(loader.dir, dir => {
                return new Promise((resolve, reject) => {
                    let mdl = this.getDirConfigModule(loader, dir);
                    if (mdl) {
                        let builder = this.findTaskDefine(mdl);
                        if (builder) {
                            resolve(builder.moduleTaskConfig);
                        }
                    }
                });
            }));
        } else {
            return super.getConfigBuild();
        }
    }

    private getDirConfigModule(loader: DirLoaderOption, dir: string) {
        let cfn = loader.dirConfigFile || './config';
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
