import { TaskOption } from './TaskConfig';
import { ITaskLoader } from './ITaskLoader';
export interface DevelopConfig {
    tasks?: TaskOption | TaskOption[];
    loaderFactory?: ((option: TaskOption) => ITaskLoader);
}
