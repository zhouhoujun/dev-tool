import * as _ from 'lodash';
import * as path from 'path';
import { existsSync } from 'fs';
import { Task, DirLoaderOption, TaskOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

export class DirLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }

    load(cfg: TaskConfig): Promise<Task[]> {
        let loader: DirLoaderOption = this.option.loader;
        if (loader.dir) {
            return this.loadTaskFromDir(loader.dir);
        } else {
            return super.load(cfg);
        }
    }

    protected getTaskDefine(): Promise<ITaskDefine> {
        let loader: DirLoaderOption = this.option.loader;
        if (!loader.taskDefine && !loader.configModule
            && !loader.module && loader.dir) {
            return Promise.race<TaskConfig>(_.map(loader.dir, dir => {
                return new Promise((resolve, reject) => {
                    let mdl = this.getDirConfigModule(loader, dir);
                    if (mdl) {
                        let def = this.findTaskDefine(mdl);
                        if (def) {
                            resolve(def);
                        }
                    }
                });
            }));
        } else {
            return super.getTaskDefine();
        }
    }

    private getDirConfigModule(loader: DirLoaderOption, dir: string) {
        let cfn = loader.dirConfigFile || './config';
        let fpath = path.join(dir, cfn);
        if (/.\S+$/.test(fpath)) {
            return require(fpath);
        } else if (existsSync(fpath + '.js')) {
            return require(fpath + '.js');
        } else if (existsSync(fpath + '.ts')) {
            return require(fpath + '.ts')
        }
    }
}
