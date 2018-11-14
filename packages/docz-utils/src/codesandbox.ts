import * as path from 'path'
import { assembleFiles } from 'codesandboxer-fs'

import { formatter } from './format'

const wrapCode = (code: string): string =>
  `import React from 'react';

  const doczStyles = {
    margin: '0 3px',
    padding: '4px 6px',
    fontFamily: '"Source Code Pro", monospace',
    fontSize: 14,
  };

  const App = ({ children }) => (
    <div style={doczStyles}>
      {children && typeof children === 'function' ? children() : children}
    </div>
  )

  export default () => (
    <App>
      ${code.split('\n').join('\n    ')}
    </App>
  )`

function getSandboxFiles(
  code: string,
  imports: string[],
  cwd: string
): Promise<any> {
  const rawCode = [...imports, formatter(wrapCode(code))].join('\n')
  const examplePath = path.join(cwd, `codesandbox.example.csb.js`)

  return assembleFiles(examplePath, {
    contents: rawCode,
    extensions: [
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.css',
      '.css.less',
      '.css.sass',
      '.less',
      '.sass',
      '.svg',
    ],
  })
}

export const getSandboxImportInfo = async (
  child: any,
  imports: string[],
  cwd: string
) => {
  let info: string | undefined

  try {
    const { parameters } = await getSandboxFiles(child, imports, cwd)
    info = parameters
  } catch (e) {
    console.error('Could not create Open in CodeSandbox', e)
  }

  return info
}
