import { Src, Task, EnvOption, Operation, TaskOption, TaskConfig, ITaskDefine, moduleTaskLoader, moduleTaskConfig } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: TaskOption;
    constructor(option: TaskOption);
    load(oper: Operation): Promise<Task[]>;
    loadConfg(oper: Operation, env: EnvOption): Promise<TaskConfig>;
    protected getConfigBuild(): Promise<moduleTaskConfig>;
    protected getConfigModule(): any;
    protected getModuleTaskLoader(): Promise<moduleTaskLoader>;
    protected getTaskModule(): any;
    protected findTaskDefine(mdl: any): ITaskDefine;
    private isTaskDefine(mdl);
    protected isTaskFunc(mdl: any, name: string): boolean;
    protected loadTaskFromModule(mdl: any): Promise<Task[]>;
    protected loadTaskFromDir(dirs: Src): Promise<Task[]>;
}
