import { ITaskLoader } from './ITaskLoader';
import { Task, TaskOption, EnvOption, TaskConfig, TaskNameSequence } from './TaskConfig';
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
    constructor(dirname: string, option: DevelopConfig);
    init(): void;
    protected run(env: EnvOption): Promise<{}[]>;
    protected toSquence(tasks: Array<string | string[] | void>): TaskNameSequence;
    protected setup(config: TaskConfig, tasks: Task[]): Promise<TaskNameSequence>;
    protected createLoader(option: TaskOption): ITaskLoader;
    protected printHelp(help: boolean | string): void;
}
export declare function files(directory: string, express?: ((fileName: string) => boolean)): string[];
