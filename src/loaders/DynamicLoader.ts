import { ITaskDefine } from 'development-core';
import taskDefine from '../utils/taskDefine';
import { BaseLoader } from './BaseLoader';
import { IContext } from '../IContext';
export class DynamicLoader extends BaseLoader {
    constructor(ctx: IContext) {
        super(ctx);
        this.name = 'dynamic';
    }

    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine> {
        return taskDefine(this.getTaskModule())
    }
}


