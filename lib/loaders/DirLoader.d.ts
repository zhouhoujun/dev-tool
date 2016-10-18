import { Task, Operation, TaskOption, configBuilder } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';
export declare class DirLoader extends BaseLoader {
    constructor(option: TaskOption);
    load(oper: Operation): Promise<Task[]>;
    protected getConfigBuild(): Promise<configBuilder>;
    private getDirConfigModule(loader, dir);
}
