import { ITaskOption } from 'development-core';
import { ITaskLoader } from './ITaskLoader';
export interface DevelopConfig {
    setupTask?: string;
    tasks: ITaskOption | ITaskOption[];
    loaderFactory?(option: ITaskOption): ITaskLoader;
}
