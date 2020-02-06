import typescript from 'rollup-plugin-typescript2';

export default {

    input: './examples/index.ts',

    output: {
        file: './examples/index.js',
        format: 'esm'
    },

    plugins: [
        typescript({
            tsconfig: 'tsconfig.json'
        })
    ]
};