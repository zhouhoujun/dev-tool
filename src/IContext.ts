import { ITaskContext, Src, IEnvOption } from 'development-core';
import { Gulp, TaskCallback } from 'gulp';
import { TaskOption } from './TaskOption';
import { ILoaderFactory } from './loaderFactory';
/**
 * development context
 * 
 * @export
 * @interface IContext
 * @extends {ITaskContext}
 */
export interface IContext extends ITaskContext {

    loaderFactory: ILoaderFactory;

    /**
     * the gulp instance.
     *
     * @type {Gulp}
     * @memberof IContext
     */
    gulp: Gulp;

    /**
     * load tasks.
     *
     * @returns {Promise<Src[]>}
     *
     * @memberof IContext
     */
    loadTasks(): Promise<Src[]>;

    /**
     * run task in this context.
     *
     * @param {IEnvOption} env
     * @returns {Promise<any>}
     *
     * @memberof IContext
     */
    run(env: IEnvOption): Promise<any>;

    /**
     * help
     *
     * @memberof IContext
     */
    help();
}
