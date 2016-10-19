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
    static create(dirname: string, option?: DevelopConfig): Development;
    private constructor(dirname, option);
    run(env: EnvOption): Promise<{}[]>;
    protected toSquence(tasks: Array<Src | void>): TaskNameSequence;
    protected setup(config: TaskConfig, tasks: Task[]): Promise<TaskNameSequence>;
    protected createLoader(option: TaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
export declare function files(directory: string, express?: ((fileName: string) => boolean)): string[];
