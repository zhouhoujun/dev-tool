import * as _ from 'lodash';
import { ITask, ITaskDefine, ITaskContext } from 'development-core';
import { IDirLoaderOption } from '../TaskOption';
import { ModuleLoader } from './ModuleLoader';
import { IContext } from '../IContext';

export class DirLoader extends ModuleLoader {

    constructor(ctx: IContext) {
        super(ctx);
    }

    loadTasks(context: ITaskContext, def: ITaskDefine): Promise<ITask[]> {
        let loader: IDirLoaderOption = this.option.loader;
        if (loader.dir) {
            return context.findTasksInDir(loader.dir);
        } else {
            return super.loadTasks(context, def);
        }
    }

    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine> {
        let loader: IDirLoaderOption = this.option.loader;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return this.ctx.findTaskDefineInDir(loader.dir);
        } else {
            return super.loadTaskDefine();
        }
    }
}
