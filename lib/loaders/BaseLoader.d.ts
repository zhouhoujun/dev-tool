/// <reference types="chai" />
import { ITask, IEnvOption, IContextDefine, ITaskContext, ITaskConfig } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: ITaskOption;
    protected env: IEnvOption;
    protected factory: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext;
    constructor(option: ITaskOption, env?: IEnvOption, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext);
    load(context: IContext): Promise<ITask[]>;
    loadContext(env: IEnvOption): Promise<IContext>;
    private _contextDef;
    protected readonly contextDef: Promise<IContextDefine>;
    protected loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected abstract getContextDefine(): IContextDefine | Promise<IContextDefine>;
    protected getConfigModule(): string | Object;
    protected getTaskModule(): string | Object;
}
