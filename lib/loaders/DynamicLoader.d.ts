import { ITaskOption, IContextDefine } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class DynamicLoader extends BaseLoader {
    constructor(option: ITaskOption);
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
