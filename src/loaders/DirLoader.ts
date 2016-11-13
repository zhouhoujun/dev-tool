import * as _ from 'lodash';
import { ITask, IDirLoaderOption, IContextDefine, ITaskOption, ITaskContext, findTaskDefineInDir, taskSourceVal } from 'development-core';
import { ModuleLoader } from './ModuleLoader';

export class DirLoader extends ModuleLoader {

    constructor(option: ITaskOption) {
        super(option);
    }

    loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]> {
        let loader: IDirLoaderOption = this.option.loader;
        if (loader.dir) {
            return context.findTasksInDir(taskSourceVal(loader.dir));
        } else {
            return super.loadTasks(context, def);
        }
    }

    protected getContextDefine(): IContextDefine | Promise<IContextDefine> {
        let loader: IDirLoaderOption = this.option.loader;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return findTaskDefineInDir(taskSourceVal(loader.dir))
        } else {
            return super.getContextDefine();
        }
    }
}
