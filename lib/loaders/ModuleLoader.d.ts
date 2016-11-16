import { IContextDefine, ITaskOption, IEnvOption } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class ModuleLoader extends BaseLoader {
    constructor(option: ITaskOption, env?: IEnvOption);
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
