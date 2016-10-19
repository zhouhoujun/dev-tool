import { Operation, Task, EnvOption, TaskConfig } from './TaskConfig';
export interface ITaskLoader {
    load(oper: Operation): Promise<Task[]>;
    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig>;
}
