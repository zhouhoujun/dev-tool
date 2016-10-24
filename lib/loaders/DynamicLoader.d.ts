import { TaskOption, ITaskDefine } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';
export declare class DynamicLoader extends BaseLoader {
    constructor(option: TaskOption);
    protected getTaskDefine(): Promise<ITaskDefine>;
}
