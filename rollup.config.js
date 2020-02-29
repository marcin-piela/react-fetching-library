import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import pkg from './package.json';
import size from 'rollup-plugin-size'
import external from 'rollup-plugin-peer-deps-external'
import { terser } from 'rollup-plugin-terser'

const config = [ {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      globals: {
        react: 'React',
      },
    },
  ],
  plugins: [
    typescript(),
    external(),
    compiler(),
    terser(),
    size({
      writeFile: false,
    }),
  ],
},
{
  input: 'src/index.ts',
  output: [{ file: pkg.types, format: 'cjs' }],
  plugins: [dts()],
},
];

export default config;
