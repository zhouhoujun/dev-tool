/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { Src, Asserts, Task, TaskOption, Operation, EnvOption, DynamicTask, TaskResult, TaskConfig } from './TaskConfig';
import { DevelopConfig } from './DevelopConfig';
export * from './DevelopConfig';
export * from './TaskConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';
export declare class Development {
    private dirname;
    protected option: DevelopConfig;
    private globals;
    static create(gulp: Gulp, dirname: string, option?: DevelopConfig): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: EnvOption): Promise<any>;
    private bindingConfig(cfg);
    runSequence(gulp: Gulp, tasks: Src[]): Promise<any>;
    protected toSquence(tasks: Array<TaskResult | TaskResult[] | void>, oper: Operation): Src[];
    protected loadTasks(gulp: Gulp, tasks: Asserts | Asserts[], env: EnvOption): Promise<Src[]>;
    protected setup(gulp: Gulp, config: TaskConfig, tasks: Task[], assertsTask: Src, subGroupTask: Src): Promise<Src[]>;
    protected loadSubTask(gulp: Gulp, config: TaskConfig): Promise<Src>;
    protected loadAssertTasks(gulp: Gulp, config: TaskConfig): Promise<Src>;
    protected createLoader(option: TaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
export declare function runSequence(gulp: Gulp, tasks: Src[]): Promise<any>;
export declare function files(directory: string, express?: ((fileName: string) => boolean)): string[];
export declare function dynamicTask(tasks: DynamicTask | DynamicTask[], oper: Operation, env: EnvOption): Task[];
