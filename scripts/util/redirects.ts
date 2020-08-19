import { promises as fs } from 'fs'
import paths from 'path'

export const createRedirects = async (metas: IDoc[]) => {
    const redirects: [string, string, number | string][] = []

    for await (let meta of metas) {
        redirects.push([
            `/blog/${meta.id}/${meta.slug}/`,
            `/blog/${meta.id}/`,
            200,
        ])
        redirects.push([
            `/blog/${meta.id}/*`,
            `/blog/${meta.id}/${meta.slug}/`,
            301,
        ])
        redirects.push([
            `/blog/${meta.id}/`,
            `/blog/${meta.id}/${meta.slug}/`,
            '301!',
        ])
    }

    const path = paths.resolve(`${__dirname}/../../dist/_redirects`)
    await fs.writeFile(
        path,
        redirects.map(([from, to, code]) => `${from} ${to} ${code}`).join('\n'),
        { flag: 'w' }
    )
}
