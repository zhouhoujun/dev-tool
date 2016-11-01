import { ITask, ITaskDefine, ITaskOption, ITaskConfig } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class DirLoader extends BaseLoader {
    constructor(option: ITaskOption);
    load(cfg: ITaskConfig): Promise<ITask[]>;
    protected getTaskDefine(): Promise<ITaskDefine>;
}
