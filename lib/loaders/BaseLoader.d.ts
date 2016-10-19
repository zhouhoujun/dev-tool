import { Src, Task, EnvOption, Operation, TaskOption, TaskConfig, ITaskDefine } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: TaskOption;
    constructor(option: TaskOption);
    load(cfg: TaskConfig): Promise<Task[]>;
    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig>;
    protected getTaskDefine(): Promise<ITaskDefine>;
    protected getConfigModule(): any;
    protected getTaskModule(): any;
    protected findTaskDefine(mdl: any): ITaskDefine;
    private isTaskDefine(mdl);
    protected isTaskFunc(mdl: any, exceptObj?: boolean): boolean;
    private findTasks(mdl);
    protected loadTaskFromModule(mdl: any): Promise<Task[]>;
    protected loadTaskFromDir(dirs: Src): Promise<Task[]>;
}
