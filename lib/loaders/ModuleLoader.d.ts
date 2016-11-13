import { IContextDefine, ITaskOption } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class ModuleLoader extends BaseLoader {
    constructor(option: ITaskOption);
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
