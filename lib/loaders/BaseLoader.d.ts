/// <reference types="chai" />
import { ITask, IEnvOption, IContextDefine, ITaskContext, ITaskOption } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: ITaskOption;
    constructor(option: ITaskOption);
    load(context: ITaskContext): Promise<ITask[]>;
    loadContext(env: IEnvOption): Promise<ITaskContext>;
    private _contextDef;
    protected readonly contextDef: Promise<IContextDefine>;
    protected loadTasks(context: ITaskContext, def: IContextDefine): Promise<ITask[]>;
    protected abstract getContextDefine(): IContextDefine | Promise<IContextDefine>;
    protected getConfigModule(): string | Object;
    protected getTaskModule(): string | Object;
}
