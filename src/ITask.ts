import { TaskCallback } from 'gulp';
import { TaskConfig } from './TaskConfig';
export interface ITask {
    name: string;
    action(config: TaskConfig, callback?: TaskCallback): Promise<any>;
}
