import { ITask, IEnvOption, ITaskContext, bindingConfig, ITaskConfig } from 'development-core';
import { ITaskOption, TaskLoader } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';

export class CustomLoader implements ITaskLoader {
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
