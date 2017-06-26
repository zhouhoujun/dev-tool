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

}
