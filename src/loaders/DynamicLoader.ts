import { IContextDefine, IEnvOption } from 'development-core';
import { ITaskOption } from '../TaskOption';
import contextDefine from '../utils/contextDefine';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: ITaskOption, env?: IEnvOption) {
        super(option, env);
    }


    protected getContextDefine(): IContextDefine | Promise<IContextDefine> {
        return contextDefine(this.getTaskModule())
    }
}


