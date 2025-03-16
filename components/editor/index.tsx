'use client'
// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    toolbarPlugin,
    ConditionalContents,
    ChangeCodeMirrorLanguage,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    CreateLink,
    InsertThematicBreak,
    InsertImage,
    InsertTable,
    InsertCodeBlock,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    imagePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'


import {basicDark} from "cm6-theme-basic-dark"
import "./dark-editor.css"
import { useTheme } from 'next-themes'
import { Separator } from '@radix-ui/react-dropdown-menu'



interface Props {
    value: string;
    fieldChange: (value: string) => void;
    editorRef: ForwardedRef<MDXEditorMethods> | null
}

const Editor = ({
    value,
    fieldChange,
    editorRef,
    ...props
}: Props) => {

    const {resolvedTheme} = useTheme()
    
    const theme = resolvedTheme === "dark" ? basicDark : []

    return (
        <div>
            <MDXEditor
                markdown={value}
                onChange={fieldChange}
                className={`background-light800_dark200 light-border-2 markdown-editor dark-editor grid w-full border h-full`}
                ref={editorRef}
                key={resolvedTheme}
                plugins={[
                    // Example Plugin Usage
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    imagePlugin(),
                    codeBlockPlugin({defaultCodeBlockLanguage: ""}),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            css: "css",
                            html: "html",
                            txt: "txt",
                            sql: "sql",
                            js: "javascript",
                            ts: "typescript",
                            sass: "sass",
                            scss: "scss",
                            json: "json",
                            bash: "bash",
                            python: "python",
                            tsx: "TypeScript (React)",
                            jsx: "JavaScript (React)",
                            "": "Plain Text"
                        },
                        autoLoadLanguageSupport: true,
                        codeMirrorExtensions: [theme],

                    }),
                    diffSourcePlugin({viewMode: 'rich-text', diffMarkdown: ''}),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarContents: ()=> {
                            return <ConditionalContents 
                                options={[
                                    {
                                        when: (editor) => editor?.editorType === "codeblock",
                                        contents: () => <ChangeCodeMirrorLanguage />
                                    },
                                    {
                                        fallback: ()=> (
                                            <>
                                                <UndoRedo/>
                                                <Separator />

                                                <BoldItalicUnderlineToggles />
                                                <Separator />

                                                <ListsToggle />
                                                <Separator/>

                                                <CreateLink />
                                                <InsertImage />
                                                <Separator />

                                                <InsertTable />
                                                <InsertThematicBreak />
                                                <InsertCodeBlock />


                                            </>
                                        )
                                    }
                                ]}
                            />
                        }
                    }),
                ]}
                {...props}
            />

        </div>
    )
}

export default Editor