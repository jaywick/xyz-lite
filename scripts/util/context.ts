import { IDoc } from '../../types'
import commandLineArgs, { OptionDefinition } from 'command-line-args'

interface IOptions {
    skipImages: boolean
    folder: string
    devServer: string
}

interface IData {
    docs: IDoc[]
    images: string[]
    publicFiles: string[]
}

export type IContext = IOptions & IData

const optionDefinitions: OptionDefinition[] = [
    { name: 'skipImages', alias: 'I', type: Boolean, defaultValue: false },
    { name: 'folder', type: String, defaultValue: 'doc' },
    { name: 'devServer', type: Boolean, defaultValue: false },
]

export const promptArgs: () => IContext = () => {
    const options = commandLineArgs(optionDefinitions) as IOptions

    console.info('Args provided', options)

    return {
        ...options,
        docs: [],
        images: [],
        publicFiles: [],
    }
}
