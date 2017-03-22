import { ITask, IContextDefine, ITaskContext, ITaskConfig, IEnvOption } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { ModuleLoader } from './ModuleLoader';
export declare class DirLoader extends ModuleLoader {
    constructor(option: ITaskOption, env: IEnvOption, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext);
    loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
