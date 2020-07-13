import paths from 'path'
import { promises as fs } from 'fs'

export async function* getFilesRecursive(root: string): AsyncIterable<string> {
    const children = await fs.readdir(root, { withFileTypes: true })
    for (const child of children) {
        const path = paths.resolve(root, child.name)

        if (child.isDirectory()) {
            yield* getFilesRecursive(path)
        } else {
            yield path
        }
    }
}

export function changeExtension(path: string, newExtension: string): string {
    return paths.join(
        paths.dirname(path),
        paths.basename(path, paths.extname(path)) + '.' + newExtension
    )
}
