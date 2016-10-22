import * as gulp from 'gulp';
import { Development } from './src/tools';

Development.create(gulp, __dirname, {
    tasks: {
        src: 'src',
        dist: 'lib',
        loader: 'development-tool-node'
    }
});
