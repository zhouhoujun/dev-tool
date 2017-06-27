import { ITask, ITaskDefine, ITaskContext } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected ctx: IContext;
    constructor(ctx: IContext);
    readonly option: ITaskOption;
    load(): Promise<ITask[]>;
    private _taskDef;
    protected readonly taskDef: Promise<ITaskDefine>;
    protected loadTasks(context: ITaskContext, def: ITaskDefine): Promise<ITask[]>;
    protected abstract loadTaskDefine(): ITaskDefine | Promise<ITaskDefine>;
    protected getConfigModule(): string | Object;
    protected getTaskModule(): string | Object;
}
