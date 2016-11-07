import { Operation, ITask, IEnvOption, ITaskConfig } from 'development-core';


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
     * @param {ITaskConfig} cfg
     * @returns {Promise<ITask[]>}
     * 
     * @memberOf ITaskLoader
     */
    load(cfg: ITaskConfig): Promise<ITask[]>;

    /**
     * load config.
     * 
     * @param {IEnvOption} env
     * @returns {Promise<ITaskConfig>}
     * 
     * @memberOf ITaskLoader
     */
    loadConfg(env: IEnvOption): Promise<ITaskConfig>;

}
