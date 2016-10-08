import { TaskConfig, LoaderOption } from './TaskConfig';
import { ITaskLoader } from './ITaskLoader';

export interface TaskOption {
    tasks?: TaskConfig | TaskConfig[];
    loaderFactory?: ((option: LoaderOption) => ITaskLoader);
}

export default {
}
