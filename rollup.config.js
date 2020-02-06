import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';

export default {

    input: './src/index.ts',

    output: [
        {
            file: './dist/Box2DLiteTS.ejs',
            format: 'esm'
        },
        {
            file: './dist/Box2DLiteTS.min.js',
            format: 'iife',
            name: 'Box2DLiteTS',
            plugins: [ terser() ]
        }
    ],

    plugins: [
        typescript({
            tsconfig: 'tsconfig.json'
        })
    ]
};