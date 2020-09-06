// resolution - insert srcset attribute

import visit from 'unist-util-visit'
import paths from 'path'
import { Node } from 'unist'

type ImageNode = Node & {
    tagName: string
    properties: { [key: string]: string | null }
}

export const lazyImages = () => (tree: Node) => {
    function visitor({ tagName, properties }: ImageNode) {
        if (tagName !== 'img') {
            return
        }

        if (!properties.loading) {
            properties.loading = 'lazy'
        }

        if (!properties.srcSet && properties.src) {
            const isExternal =
                properties.src.startsWith('http') ||
                properties.src.startsWith('//')

            if (!isExternal) {
                const { name, ext } = paths.parse(properties.src)
                properties.srcSet = ['320w', '480w', '768w', '1024w']
                    .map((size) => `${name}-${size}${ext} ${size}`)
                    .concat(`${name}${ext} 1200w`)
                    .join(', ')
                properties.sizes = '100vw'
            }
        }
    }

    visit(tree, ['element'], visitor)
}
