import { ITaskOption, ITaskDefine, IDynamicLoaderOption } from 'development-core';
import dynamicTaskDefine from './dynamicTaskDefine';
import { BaseLoader } from './BaseLoader';

export class DynamicLoader extends BaseLoader {

    constructor(option: ITaskOption) {
        super(option);
    }


    protected getTaskDefine(): Promise<ITaskDefine> {
        let tsdef: ITaskDefine = null;
        let loader: IDynamicLoaderOption = this.option.loader;
        if (loader.taskDefine) {
            tsdef = loader.taskDefine;
        } else {
            tsdef = dynamicTaskDefine(this.getTaskModule())
        }

        return Promise.resolve(tsdef);
    }
}


