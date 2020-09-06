// resolution - insert srcset attribute

import visit from 'unist-util-visit'
import paths from 'path'
import { Node } from 'unist'

type ImageNode = Node & {
    tagName: string
    properties: { [key: string]: unknown }
}

export const lazyImages = () => (tree: Node) => {
    function visitor(node: ImageNode) {
        const {
            tagName,
            properties: { src, srcSet },
        } = node

        if (tagName !== 'img' || typeof src !== 'string' || srcSet) {
            return
        }

        node.properties.loading = 'lazy'
    }

    visit(tree, ['element'], visitor)
}
