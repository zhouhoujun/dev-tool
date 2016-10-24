import { Task, TaskOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { BaseLoader } from './BaseLoader';
export declare class DirLoader extends BaseLoader {
    constructor(option: TaskOption);
    load(cfg: TaskConfig): Promise<Task[]>;
    protected getTaskDefine(): Promise<ITaskDefine>;
    private getDirConfigModule(loader, dir);
}
