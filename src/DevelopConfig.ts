import { TaskOption } from './TaskConfig';
import { ITaskLoader } from './ITaskLoader';
// import { Operation } from './Operation';

export interface DevelopConfig {
    tasks: TaskOption | TaskOption[];
    loaderFactory?: ((option: TaskOption) => ITaskLoader);
}
