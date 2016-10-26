import { TaskOption } from './TaskConfig';
import { ITaskLoader } from './ITaskLoader';
export interface DevelopConfig {
    setupTask?: string;
    tasks: TaskOption | TaskOption[];
    loaderFactory?(option: TaskOption): ITaskLoader;
}
