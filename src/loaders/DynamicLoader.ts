import { ITaskOption, IContextDefine } from 'development-core';
import contextDefine from '../utils/contextDefine';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: ITaskOption) {
        super(option);
    }


    protected getContextDefine(): IContextDefine | Promise<IContextDefine> {
        return contextDefine(this.getTaskModule())
    }
}


