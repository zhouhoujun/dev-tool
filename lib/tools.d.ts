/// <reference types="gulp" />
import { Gulp, TaskCallback } from 'gulp';
import { ITaskLoader } from './ITaskLoader';
import { Src, Task, TaskOption, EnvOption, TaskConfig, TaskNameSequence } from './TaskConfig';
import { DevelopConfig } from './DevelopConfig';
export * from './DevelopConfig';
export * from './TaskConfig';
export * from './ITaskLoader';
export * from './LoaderFactory';
export * from './loaders/BaseLoader';
export declare class Development {
    private dirname;
    protected option: DevelopConfig;
    static create(gulp: Gulp, dirname: string, option?: DevelopConfig): Development;
    private constructor(dirname, option);
    run(gulp: Gulp, env: EnvOption, callback: TaskCallback): Promise<any>;
    runSequence(gulp: Gulp, tasks: TaskNameSequence): Promise<any>;
    protected toSquence(tasks: Array<Src | void>): TaskNameSequence;
    protected setup(gulp: Gulp, config: TaskConfig, tasks: Task[]): Promise<TaskNameSequence>;
    protected createLoader(option: TaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
export declare function files(directory: string, express?: ((fileName: string) => boolean)): string[];
