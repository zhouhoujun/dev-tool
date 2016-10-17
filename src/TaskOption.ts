import { TaskConfig, LoaderOption } from './TaskConfig';
import { ITaskLoader } from './ITaskLoader';
import { Operation } from './Operation';

export type configBuilder = (oper: Operation) => TaskConfig;

export interface TaskOption {
    tasks?: TaskConfig | TaskConfig[];
    taskConfig?: string | (() => configBuilder);
    taskConfigFileName?: string;
    loaderFactory?: ((option: LoaderOption) => ITaskLoader);
}

export default {
}
