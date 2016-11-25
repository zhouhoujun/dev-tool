import { IContextDefine, IEnvOption, ITaskConfig, ITaskContext } from 'development-core';
import { ITaskOption } from '../TaskOption';
import contextDefine from '../utils/contextDefine';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: ITaskOption, env?: IEnvOption, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext) {
        super(option, env, factory);
    }


    protected getContextDefine(): IContextDefine | Promise<IContextDefine> {
        return contextDefine(this.getTaskModule())
    }
}


