import { ITaskDefine } from 'development-core';
import taskDefine from '../utils/taskDefine';
import { BaseLoader } from './BaseLoader';
import { IContext } from '../IContext';
export class DynamicLoader extends BaseLoader {

    constructor(ctx: IContext) {
        super(ctx);
    }

    protected loadTaskDefine(): ITaskDefine | Promise<ITaskDefine> {
        return taskDefine(this.getTaskModule())
    }
}


