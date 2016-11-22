/// <reference types="chai" />
import { ITask, IEnvOption, IContextDefine, ITaskContext } from 'development-core';
import { ITaskOption, IContext } from '../TaskOption';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: ITaskOption;
    protected env: IEnvOption;
    constructor(option: ITaskOption, env?: IEnvOption);
    load(context: IContext): Promise<ITask[]>;
    loadContext(env: IEnvOption): Promise<IContext>;
    private _contextDef;
    protected readonly contextDef: Promise<IContextDefine>;
    protected loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected abstract getContextDefine(): IContextDefine | Promise<IContextDefine>;
    protected getConfigModule(): string | Object;
    protected getTaskModule(): string | Object;
}
