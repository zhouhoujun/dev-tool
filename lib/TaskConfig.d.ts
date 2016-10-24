/// <reference types="gulp" />
/// <reference types="node" />
import { Gulp, WatchEvent, WatchCallback } from 'gulp';
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
    module?: string | Object;
    configModule?: string | Object;
    taskModule?: string | Object;
    taskDefine?: ITaskDefine;
    isTaskFunc?(mdl: any): boolean;
    isTaskDefine?(mdl: any): boolean;
}
export interface DirLoaderOption extends LoaderOption {
    dir?: string[];
    dirConfigFile?: string;
}
export interface ITransform extends NodeJS.ReadWriteStream {
    pipe(stream: NodeJS.ReadWriteStream): ITransform;
}
export interface Output extends ITransform {
    dts?: ITransform;
    js?: ITransform;
}
export declare type Pipe = (config?: TaskConfig) => ITransform | Promise<ITransform>;
export declare type OutputPipe = (map: Output, config?: TaskConfig) => ITransform | Promise<ITransform>;
export interface DynamicTask {
    name: string;
    oper?: Operation;
    watch?: Array<string | WatchCallback>;
    watchChanged?(event: WatchEvent, config: TaskConfig): any;
    pipe?(gulpsrc: ITransform, config: TaskConfig): ITransform | Promise<ITransform>;
    pipes?: Pipe | Pipe[];
    output?: OutputPipe | OutputPipe[];
    task?(config: TaskConfig, gulp: Gulp): void | ITransform | Promise<any>;
}
export interface DynamicLoaderOption extends LoaderOption {
    dynamicTasks?: DynamicTask | DynamicTask[];
}
export interface Asserts {
    src: Src;
    dist?: string;
    build?: string;
    release?: string;
    deploy?: string;
}
export interface TaskOption extends Asserts {
    loader: string | LoaderOption | DynamicTask | DynamicTask[];
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
    runTasks?(subGroupTask?: Src, tasks?: Src[]): Src[];
    printHelp?(lang: string): void;
    findTasksInModule?(module: string): Promise<Task[]>;
    findTasksInDir?(dirs: Src): Promise<Task[]>;
    getDist?(asserts?: Asserts): string;
    fileFilter?(directory: string, express?: ((fileName: string) => boolean)): string[];
    runSequence?(gulp: Gulp, tasks: Src[]): Promise<any>;
    dynamicTasks?(tasks: DynamicTask | DynamicTask[]): Task[];
}
