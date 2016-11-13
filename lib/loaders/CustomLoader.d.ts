import { ITask, customLoader, IEnvOption, ITaskContext, ITaskOption } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';
export declare class CustomLoader implements ITaskLoader {
    private option;
    private loader;
    constructor(option: ITaskOption, loader: customLoader);
    load(context: ITaskContext): Promise<ITask[]>;
    private condef;
    loadContext(env: IEnvOption): Promise<ITaskContext>;
}
