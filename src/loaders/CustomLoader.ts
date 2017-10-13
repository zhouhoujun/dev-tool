import { ITask, IEnvOption, ITaskContext, bindingConfig, ITaskConfig } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
import { TaskLoader } from '../types';

/**
 * custom loader.
 *
 * @export
 * @class CustomLoader
 * @implements {ITaskLoader}
 */
export class CustomLoader implements ITaskLoader {
    name = 'custom';
    private tasks: Promise<ITask[]>;
    constructor(protected ctx: IContext, protected loader: TaskLoader) {
    }
    load(): Promise<ITask[]> {
        if (!this.tasks) {
            this.tasks = Promise.resolve(this.loader(this.ctx));
        }
        return this.tasks;
    }
}
