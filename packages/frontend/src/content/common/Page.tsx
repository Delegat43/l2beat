import React, { ReactNode } from 'react'

import { PageMetadata } from '../PageMetadata'
import { Head } from './head'
import { Tooltip } from './Tooltip'

interface Props {
  children: ReactNode
  preloadApi?: string
  includeMetaImageStyles?: boolean
  metadata: PageMetadata
}

export function Page(props: Props) {
  return (
    <html lang="en">
      <Head
        {...props.metadata}
        preloadApi={props.preloadApi}
        includeMetaImageStyles={props.includeMetaImageStyles}
      />
      <body className="bg-white text-black dark:bg-black dark:text-white">
        <div className="Page">{props.children}</div>
        <Tooltip />
        <script src="/scripts/main.js" />
      </body>
    </html>
  )
}
