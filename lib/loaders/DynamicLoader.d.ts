import { ITaskOption, IContextDefine, IEnvOption } from 'development-core';
import { BaseLoader } from './BaseLoader';
export declare class DynamicLoader extends BaseLoader {
    constructor(option: ITaskOption, env?: IEnvOption);
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
