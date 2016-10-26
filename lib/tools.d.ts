/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { Src, Task, TaskOption, Operation, EnvOption, TaskResult, TaskConfig } from 'development-core';
import { DevelopConfig } from './DevelopConfig';
export * from './DevelopConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';
export declare class Development {
    private dirname;
    protected option: DevelopConfig;
    private globals;
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | TaskOption[]): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: EnvOption): Promise<any>;
    private bindingConfig(cfg);
    runSequence(gulp: Gulp, tasks: Src[]): Promise<any>;
    protected toSequence(tasks: Array<TaskResult | TaskResult[] | void>, oper: Operation): Src[];
    protected loadTasks(gulp: Gulp, tasks: TaskOption | TaskOption[], env: EnvOption): Promise<Src[]>;
    protected setup(gulp: Gulp, config: TaskConfig, tasks: Task[], assertsTask: TaskResult, subGroupTask: TaskResult): Promise<Src[]>;
    protected loadSubTask(gulp: Gulp, config: TaskConfig): Promise<TaskResult>;
    protected loadAssertTasks(gulp: Gulp, config: TaskConfig): Promise<TaskResult>;
    protected createLoader(option: TaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
