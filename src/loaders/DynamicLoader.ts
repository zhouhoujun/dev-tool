import { TaskOption, ITaskDefine } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: TaskOption) {
        super(option);
    }


    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        if (!_.isString(this.option.loader)) {
            if (this.option.loader.taskDefine) {
                tsdef = this.option.loader.taskDefine;
            }
        }

        return Promise.resolve(tsdef);
    }
}
