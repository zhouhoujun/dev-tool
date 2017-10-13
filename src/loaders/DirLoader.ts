import { ITask, ITaskDefine, ITaskContext } from 'development-core';
import { ModuleLoader } from './ModuleLoader';
import { IContext } from '../IContext';
import { IDirLoaderOption } from '../IDirLoaderOption';

/**
 * load task in directies.
 *
 * @export
 * @class DirLoader
 * @extends {ModuleLoader}
 */
export class DirLoader extends ModuleLoader {

    constructor(ctx: IContext) {
        super(ctx);
        this.name = 'dir';
    }

    loadTasks(context: ITaskContext, def: ITaskDefine): Promise<ITask[]> {
        let loader: IDirLoaderOption = this.option.loader as IDirLoaderOption;
        if (loader.dir) {
            return context.findTasksInDir(loader.dir);
        } else {
            return super.loadTasks(context, def);
        }
    }

    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine> {
        let loader: IDirLoaderOption = this.option.loader as IDirLoaderOption;
        if (!loader.configModule
            && !loader.module && loader.dir) {
            return this.ctx.findTaskDefineInDir(loader.dir);
        } else {
            return super.loadTaskDefine();
        }
    }
}
