import { TaskConfig } from './TaskConfig';
import { TaskOption } from './TaskOption';
import { Operation }  from './Operation';

export type Task = (config: TaskConfig, callback?: Function) => string | string[];

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
    load(oper: Operation): Promise<Task[]>;

    /**
     * load config.
     * 
     * @param {Operation} oper
     * @returns {Promise<TaskConfig>}
     * 
     * @memberOf ITaskLoader
     */
    loadConfg(oper: Operation, option: TaskOption): Promise<TaskConfig>;

}
