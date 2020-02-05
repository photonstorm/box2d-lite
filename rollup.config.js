import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = [
    '.js', '.jsx', '.ts', '.tsx', '.d.ts'
];

export default {

    input: './examples/index.ts',

    output: {
        file: './examples/index.js',
        format: 'es'
    },

    plugins: [
        resolve({
            extensions
        }),

        //  Used here instead of .babelrc so it applies to external modules, too.
        babel({
            extensions,
            comments: false,
            presets: [
                [ "@babel/preset-env", {
                    targets: {
                        esmodules: true
                    }
                }],
                [ "minify", {
                    removeConsole: false,
                }],
                "@babel/preset-typescript"
            ],
            plugins: [
                "@babel/proposal-class-properties",
                "@babel/proposal-object-rest-spread"
            ]
        })

    ]
};