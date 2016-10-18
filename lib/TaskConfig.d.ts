export declare enum Operation {
    build = 0,
    test = 1,
    e2e = 2,
    release = 3,
    deploy = 4,
}
export declare type TaskNameSequence = Array<string | string[] | Function>;
export declare type Task = (config: TaskConfig, callback?: Function) => string | string[] | void;
export declare type configBuilder = (oper: Operation, option: TaskOption) => TaskConfig;
export declare type tasksInDir = (dirs: string | string[]) => Promise<Task[]>;
export declare type moduleTaskLoader = (oper: Operation, option: TaskOption, loadFromDir?: tasksInDir) => Task[];
export interface EnvOption {
    path?: string;
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
    grp?: string | string[];
}
export interface LoaderOption {
    type: string;
    module?: string;
    configModule?: string;
    taskModule?: string;
    moduleTaskConfig?: string | configBuilder;
    moduleTaskloader?: string | moduleTaskLoader;
    isTaskFunc?: ((name: string) => boolean);
}
export interface DirLoaderOption extends LoaderOption {
    dir?: string[];
    dirConfigFile?: string;
    dirConfigBuilderName?: string | string[];
}
export interface TaskOption {
    loader: LoaderOption;
    src: string;
    dist: string;
    externalTask?: Task;
    runTasks?: TaskNameSequence | ((oper: Operation, tasks: TaskNameSequence) => TaskNameSequence);
}
export interface TaskConfig {
    env: EnvOption;
    oper: Operation;
    option: TaskOption;
    runTasks?(): TaskNameSequence;
    printHelp?(lang: string): void;
}
