import { IContextDefine, IEnvOption, ITaskConfig, ITaskContext } from 'development-core';
import { ITaskOption } from '../TaskOption';
import { BaseLoader } from './BaseLoader';
export declare class ModuleLoader extends BaseLoader {
    constructor(option: ITaskOption, env?: IEnvOption, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext);
    protected getContextDefine(): IContextDefine | Promise<IContextDefine>;
}
