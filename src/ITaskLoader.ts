import { ITask } from './ITask';
import { TaskConfig } from './TaskConfig';
import { Operation }  from './Operation';

/**
 * task loader.
 * 
 * @export
 * @interface ITaskLoader
 */
export interface ITaskLoader {
    /**
     * load task.
     * 
     * @param {Operation} oper
     * @returns {Promise<ITask[]>}
     * 
     * @memberOf ITaskLoader
     */
    load(oper: Operation): Promise<ITask[]>;

    /**
     * setup task.
     * 
     * @param {TaskConfig} config
     * 
     * @memberOf ITaskLoader
     */
    setup(config: TaskConfig);
}
