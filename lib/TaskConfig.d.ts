/// <reference types="gulp" />
import { Gulp } from 'gulp';
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
export declare type Task = (gulp: Gulp, config: TaskConfig) => Src | void;
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
    type?: string;
    module?: string;
    configModule?: string;
    taskModule?: string;
    taskDefine?: ITaskDefine;
    isTaskFunc?(mdl: any): boolean;
    isTaskDefine?(mdl: any): boolean;
}
export interface DirLoaderOption extends LoaderOption {
    dir?: string[];
    dirConfigFile?: string;
    dirmoduleTaskConfigName?: Src;
}
export interface Asserts {
    src: Src;
    dist?: string;
    build?: string;
    release?: string;
    deploy?: string;
}
export interface TaskOption extends Asserts {
    loader: string | LoaderOption;
    externalTask?: Task;
    runTasks?: Src[] | ((oper: Operation, tasks: Src[], subGroupTask?: Src) => Src[]);
    tasks?: TaskOption | TaskOption[];
}
export interface ITaskDefine {
    moduleTaskConfig(oper: Operation, option: TaskOption, env: EnvOption): TaskConfig;
    moduleTaskLoader?(config: TaskConfig): Promise<Task[]>;
}
export interface TaskConfig {
    globals?: any;
    env: EnvOption;
    oper: Operation;
    option: TaskOption;
    runTasks?(subGroupTask?: Src): Src[];
    printHelp?(lang: string): void;
    findTasksInModule?(module: string): Promise<Task[]>;
    findTasksInDir?(dirs: Src): Promise<Task[]>;
    getDist?(asserts: Asserts): string;
    fileFilter?(directory: string, express?: ((fileName: string) => boolean)): string[];
    runSequence?(gulp: Gulp, tasks: Src[]): Promise<any>;
}
