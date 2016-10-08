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
     * @param {ITask[]} tasks
     * @returns {Promise<Array<string|string[]>>}
     
     * @memberOf ITaskLoader
     */
    setup(config: TaskConfig, tasks: ITask[]): Promise<Array<string | string[] | Function>>;
}
