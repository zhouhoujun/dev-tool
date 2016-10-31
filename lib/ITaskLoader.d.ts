import { Operation, ITask, IEnvOption, ITaskConfig } from 'development-core';
export interface ITaskLoader {
    load(cfg: ITaskConfig): Promise<ITask[]>;
    loadConfg(oper: Operation, env: IEnvOption): Promise<ITaskConfig>;
}
