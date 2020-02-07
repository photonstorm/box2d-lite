import typescript from 'rollup-plugin-typescript2';
// import {terser} from 'rollup-plugin-terser';

export default {

    input: './examples/index.ts',

    output: [
        {
            file: './examples/index.js',
            format: 'esm'
        },
        // {
        //     file: './examples/index.min.js',
        //     format: 'iife',
        //     name: 'Box2DLiteTS',
        //     plugins: [ terser() ]
        // }
    ],

    plugins: [
        typescript({
            tsconfig: 'tsconfig.json'
        })
    ]
};