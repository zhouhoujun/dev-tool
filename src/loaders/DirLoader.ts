import * as _ from 'lodash';
import { ITask } from '../ITask';
import { TaskConfig } from '../TaskConfig';
import { ITaskLoader }  from '../ITaskLoader';
import { Operation }  from '../Operation';
const requireDir = require('require-dir');

export interface OperateTask {
    folder: string;
    main: string;
}
export interface Operates {

}

export class DirLoader implements ITaskLoader {

    constructor(private taskDirs: string[]) {

    }
    load(oper: Operation): Promise<ITask[]> {

        return new Promise((reslove, reject) => {
            let modules = [];
            _.each(this.taskDirs, (taskDir: string) => {

                console.log('begin load task from', taskDir);

                let tasks = requireDir(taskDir, { recurse: true });

                // console.log(tasks);

                _.each(_.keys(tasks), (key: string) => {
                    console.log('register task from:', key);
                    if (key === 'task-config') {
                        return;
                    }

                    let taskMdl = tasks[key];
                    let result = null;
                    if (_.isFunction(taskMdl)) {
                        result = taskMdl(config, gulp);
                    } else if (_.isFunction(taskMdl.default)) {
                        result = taskMdl.default(config, gulp);
                    } else if (taskMdl) {
                        result = taskMdl;
                    }

                    if (result) {
                        if (_.isArray(result)) {
                            _.each(result, r => {
                                if (r && r.taskname && _.isFunction(r.task)) {
                                    gulp.task(r.taskname, r.dependent || [], r.task);
                                }
                            });
                        } else if (result.taskname && _.isFunction(result.task)) {
                            gulp.task(result.taskname, result.dependent || [], result.task);
                        }
                    }
                })
            });

            this.loaded.concat(taskDir);
        });
    }


    setup(config: TaskConfig, tasks: ITask[]): Promise<Array<string | string[]>> {

    }
}
