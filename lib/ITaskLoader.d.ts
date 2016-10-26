import { Operation, Task, EnvOption, TaskConfig } from 'development-core';
export interface ITaskLoader {
    load(cfg: TaskConfig): Promise<Task[]>;
    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig>;
}
