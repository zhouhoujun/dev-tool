import { ITaskOption, ITaskDefine } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class DynamicLoader extends BaseLoader {
    constructor(option: ITaskOption);
    protected getTaskDefine(): Promise<ITaskDefine>;
}
