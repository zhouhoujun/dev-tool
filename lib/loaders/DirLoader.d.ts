import { ITask, IContextDefine, ITaskContext, IEnvOption } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { ModuleLoader } from './ModuleLoader';
export declare class DirLoader extends ModuleLoader {
    constructor(option: ITaskOption, env: IEnvOption);
    loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
