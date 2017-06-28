import { ITask } from 'development-core';
import { TaskLoader } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
export declare class CustomLoader implements ITaskLoader {
    protected ctx: IContext;
    protected loader: TaskLoader;
    constructor(ctx: IContext, loader: TaskLoader);
    load(): Promise<ITask[]>;
}
