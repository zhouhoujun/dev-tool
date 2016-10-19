export declare enum Operation {
    build = 0,
    test = 1,
    e2e = 2,
    release = 3,
    deploy = 4,
}
export interface IMap<T> {
    [K: string]: T;
}
export declare type Src = string | string[];
export declare type TaskNameSequence = Array<Src | Function>;
export declare type Task = (config: TaskConfig, callback?: Function) => Src | void;
export declare type tasksInDir = (dirs: Src) => Promise<Task[]>;
export declare type tasksInModule = (dirs: Src) => Promise<Task[]>;
export declare type moduleTaskConfig = (oper: Operation, option: TaskOption, env: EnvOption) => TaskConfig;
export declare type moduleTaskLoader = (oper: Operation, option: TaskOption, findInModule: tasksInModule, findInDir: tasksInDir) => Promise<Task[]>;
export interface EnvOption {
    root?: string;
    help?: boolean | string;
    test?: boolean | string;
    serve?: boolean | string;
    e2e?: boolean | string;
    release?: boolean;
    deploy?: boolean;
    watch?: boolean | string;
    task?: string;
    config?: string;
    key?: number;
    value?: number;
    csv?: string;
    dist?: string;
    lang?: string;
    publish?: boolean | string;
    grp?: Src;
}
export interface LoaderOption {
    type: string;
    module?: string;
    configModule?: string;
    taskModule?: string;
    moduleTaskConfig?: string | moduleTaskConfig;
    moduleTaskloader?: string | moduleTaskLoader;
    isTaskFunc?(mdl: any, name: string): boolean;
    isTaskDefine?(mdl: any): boolean;
}
export interface DirLoaderOption extends LoaderOption {
    dir?: string[];
    dirConfigFile?: string;
    dirmoduleTaskConfigName?: Src;
}
export interface TaskOption {
    loader: LoaderOption;
    src: string;
    dist: string;
    externalTask?: Task;
    runTasks?: TaskNameSequence | ((oper: Operation, tasks: TaskNameSequence) => TaskNameSequence);
}
export interface ITaskDefine {
    moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig;
    moduleTaskLoader?(oper: Operation, option: TaskOption, findInModule: tasksInModule, findInDir: tasksInDir): Promise<Task[]>;
}
export interface TaskConfig {
    env: EnvOption;
    oper: Operation;
    option: TaskOption;
    runTasks?(): TaskNameSequence;
    printHelp?(lang: string): void;
}
