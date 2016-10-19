import { Task, Operation, TaskOption, moduleTaskConfig } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';
export declare class DirLoader extends BaseLoader {
    constructor(option: TaskOption);
    load(oper: Operation): Promise<Task[]>;
    protected getConfigBuild(): Promise<moduleTaskConfig>;
    private getDirConfigModule(loader, dir);
}
