/// <reference types="gulp" />
import { Gulp } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { Src, ITaskInfo, ITask, ITaskOption, IEnvOption, ITaskConfig } from 'development-core';
import { DevelopConfig } from './DevelopConfig';
export * from './DevelopConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';
export declare class Development {
    private dirname;
    protected option: DevelopConfig;
    private globals;
    static create(gulp: Gulp, dirname: string, setting: DevelopConfig | ITaskOption[]): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: IEnvOption): Promise<any>;
    private bindingConfig(cfg);
    protected loadTasks(gulp: Gulp, tasks: ITaskOption | ITaskOption[], env: IEnvOption): Promise<Src[]>;
    protected setup(gulp: Gulp, config: ITaskConfig, tasks: ITask[], assertsTask: ITaskInfo, subGroupTask: ITaskInfo): Promise<Src[]>;
    protected loadSubTask(gulp: Gulp, config: ITaskConfig): Promise<ITaskInfo>;
    protected loadAssertTasks(gulp: Gulp, config: ITaskConfig): Promise<ITaskInfo>;
    protected createLoader(option: ITaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
