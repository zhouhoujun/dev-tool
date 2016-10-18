import { ITaskLoader } from './ITaskLoader';
import { TaskOption } from './TaskConfig';
export interface ILoaderFactory {
    create(option: TaskOption): ITaskLoader;
}
export declare class LoaderFactory implements ILoaderFactory {
    constructor();
    create(option: TaskOption): ITaskLoader;
}
