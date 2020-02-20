import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import pkg from './package.json';

const config = [ {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [
    typescript(),
    compiler(),
  ],
},
{
  input: 'src/index.ts',
  output: [{ file: pkg.types, format: 'cjs' }],
  plugins: [dts()],
},
];

export default config;
