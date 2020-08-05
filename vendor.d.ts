declare module 'yurnalist' {
    export class BaseReporter {
        constructor(opts?: ReporterOptions = {})

        formatter: Formatter
        language: Language
        stdout: Stdout
        stderr: Stdout
        stdin: Stdin
        isTTY: boolean
        emoji: boolean
        noProgress: boolean
        isVerbose: boolean
        isSilent: boolean
        nonInteractive: boolean
        format: Formatter

        peakMemoryInterval: ?IntervalID
        peakMemory: number
        startTime: number

        lang(key: LanguageKeys, ...args: Array<mixed>): string

        /**
         * `stringifyLangArgs` run `JSON.stringify` on strings too causing
         * them to appear quoted. This marks them as "raw" and prevents
         * the quoting and escaping
         */
        rawText(str: string): { inspect(): string }

        verbose(msg: string)

        verboseInspect(val: any)

        _verbose(msg: string)

        _verboseInspect(val: any)

        _getStandardInput(): Stdin

        checkPeakMemory(): void

        close(): void

        getTotalTime(): number

        // TODO
        list(key: string, items: Array<string>, hints?: Object)

        // Outputs basic tree structure to console
        tree(
            key: string,
            obj: Trees,
            { force = false }: { force?: boolean } = {}
        )

        // called whenever we begin a step in the CLI.
        step(current: number, total: number, message: string, emoji?: string)

        // a error message has been triggered. this however does not always meant an abrupt
        // program end.
        error(message: string)

        // an info message has been triggered. this provides things like stats and diagnostics.
        info(message: string)

        // a warning message has been triggered.
        warn(message: string)

        // a success message has been triggered.
        success(message: string)

        // a simple log message
        // TODO: rethink the {force} parameter. In the meantime, please don't use it (cf comments in #4143).
        log(message: string, { force = false }: { force?: boolean } = {})

        // a shell command has been executed
        command(command: string)

        // inspect and pretty-print any value
        inspect(value: any)

        // the screen shown at the very start of the CLI
        header(command: string, pkg: Package)

        // the screen shown at the very end of the CLI
        footer(showPeakMemory: boolean)

        // a table structure
        table(head: Array<string>, body: Array<Array<string>>)

        // render an activity spinner and return a function that will trigger an update
        activity(): ReporterSpinner

        //
        activitySet(total: number, workers: number): ReporterSpinnerSet

        //
        question(
            question: string,
            options?: QuestionOptions = {}
        ): Promise<string>

        //
        questionAffirm(question: string): Promise<boolean>

        // prompt the user to select an option from an array
        select(
            header: string,
            question: string,
            options: Array<ReporterSelectOption>
        ): Promise<string>

        // render a progress bar and return a function which when called will trigger an update
        progress(total: number): () => void

        // utility function to disable progress bar
        disableProgress()

        //
        prompt<T>(
            message: string,
            choices: Array<*>,
            options?: PromptOptions = {}
        ): Promise<Array<T>>
    }

    export type Stdout = stream$Writable | tty$WriteStream
    export type Stdin = stream$Readable | tty$ReadStream
    export type Package = {
        name: string
        version: string
    }

    export type Tree = {
        name: string
        children?: Trees
        hint?: ?string
        hidden?: boolean
        color?: ?string
    }

    export type Trees = Array<Tree>

    export type ReporterSpinner = {
        tick: (name: string) => void
        end: () => void
    }

    export type ReporterSelectOption = {
        name: string
        value: string
    }

    export type ReporterSpinnerSet = {
        spinners: Array<ReporterSetSpinner>
        end: () => void
    }

    export type ReporterSetSpinner = {
        clear: () => void
        setPrefix: (current: number, prefix: string) => void
        tick: (msg: string) => void
        end: () => void
    }

    export type QuestionOptions = {
        password?: boolean
        required?: boolean
    }

    export type InquirerPromptTypes =
        | 'list'
        | 'rawlist'
        | 'expand'
        | 'checkbox'
        | 'confirm'
        | 'input'
        | 'password'
        | 'editor'

    export type PromptOptions = {
        name?: string
        type?: InquirerPromptTypes
        validate?: (input: string | Array<string>) => boolean | string
    }

    export default new BaseReporter()
}
