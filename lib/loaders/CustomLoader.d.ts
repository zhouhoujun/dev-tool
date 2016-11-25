import { ITask, IEnvOption, ITaskContext, ITaskConfig } from 'development-core';
import { ITaskOption, customLoader } from '../TaskOption';
import { IContext } from '../IContext';
import { ITaskLoader } from '../ITaskLoader';
export declare class CustomLoader implements ITaskLoader {
    private option;
    private loader;
    private factory;
    constructor(option: ITaskOption, loader: customLoader, factory?: (cfg: ITaskConfig, parent?: ITaskContext) => ITaskContext);
    load(context: ITaskContext): Promise<ITask[]>;
    private condef;
    loadContext(env: IEnvOption): Promise<IContext>;
}
