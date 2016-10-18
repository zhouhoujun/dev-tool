import { Task, Operation, TaskOption, TaskConfig, moduleTaskLoader, configBuilder } from '../TaskConfig';
import { ITaskLoader } from '../ITaskLoader';
export declare abstract class BaseLoader implements ITaskLoader {
    protected option: TaskOption;
    constructor(option: TaskOption);
    protected getConfigBuild(): Promise<configBuilder>;
    protected getConfigModule(): any;
    protected getModuleTaskLoader(): Promise<moduleTaskLoader>;
    protected getTaskModule(): any;
    protected loadTask(mdl: any): Task[];
    protected isTaskFunc(name: string): boolean;
    protected loadTaskFromDir(dirs: string | string[]): Promise<Task[]>;
    configMethods: string[];
    taskLoaderMethods: string[];
    load(oper: Operation): Promise<Task[]>;
    loadConfg(oper: Operation): Promise<TaskConfig>;
    protected findMethod(mdl: any, methods: string | string[]): any;
}
