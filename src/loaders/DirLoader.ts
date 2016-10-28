import * as _ from 'lodash';
import { ITask, IDirLoaderOption, ITaskOption, ITaskConfig, ITaskDefine, findTaskDefineInDir , taskSourceVal } from 'development-core';
import { BaseLoader } from './BaseLoader';

export class DirLoader extends BaseLoader {

    constructor(option: ITaskOption) {
        super(option);
    }

    load(cfg: ITaskConfig): Promise<ITask[]> {
        let loader: IDirLoaderOption = this.option.loader;
        if (loader.dir) {
            return cfg.findTasksInDir(taskSourceVal(loader.dir));
        } else {
            return super.load(cfg);
        }
    }

    protected getTaskDefine(){
        let loader: IDirLoaderOption = this.option.loader;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return findTaskDefineInDir(taskSourceVal(loader.dir))
        } else {
            return super.getTaskDefine();
        }
    }
}
