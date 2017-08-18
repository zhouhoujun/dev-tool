import { ITask } from 'development-core';
import { TaskLoader } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
/**
 * custom loader.
 *
 * @export
 * @class CustomLoader
 * @implements {ITaskLoader}
 */
export declare class CustomLoader implements ITaskLoader {
    protected ctx: IContext;
    protected loader: TaskLoader;
    name: string;
    private tasks;
    constructor(ctx: IContext, loader: TaskLoader);
    load(): Promise<ITask[]>;
}
