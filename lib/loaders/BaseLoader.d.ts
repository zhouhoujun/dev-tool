/// <reference types="chai" />
import { ITask, IEnvOption, ITaskOption, ITaskConfig, ITaskDefine } from 'development-core';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: ITaskOption;
    constructor(option: ITaskOption);
    load(cfg: ITaskConfig): Promise<ITask[]>;
    loadConfg(env: IEnvOption): Promise<ITaskConfig>;
    protected bindingConfig(cfg: ITaskConfig): ITaskConfig;
    protected getTaskDefine(): Promise<ITaskDefine>;
    protected getConfigModule(): string | Object;
    protected getTaskModule(): string | Object;
}
