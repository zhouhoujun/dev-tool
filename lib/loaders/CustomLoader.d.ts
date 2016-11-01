import { ITask, customLoader, Operation, IEnvOption, ITaskOption, ITaskDefine, ITaskConfig } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';
export declare class CustomLoader implements ITaskLoader {
    private option;
    private loader;
    constructor(option: ITaskOption, loader: customLoader);
    load(cfg: ITaskConfig): Promise<ITask[]>;
    loadConfg(oper: Operation, env: IEnvOption): Promise<ITaskConfig>;
    protected getTaskDefine(): Promise<ITaskDefine>;
}