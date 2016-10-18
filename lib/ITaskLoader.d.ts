import { Operation, Task, TaskConfig } from './TaskConfig';
export interface ITaskLoader {
    load(oper: Operation): Promise<Task[]>;
    loadConfg(oper: Operation): Promise<TaskConfig>;
}
