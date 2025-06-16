import React from 'react'
import { Code } from "bright"
import { MDXRemote } from "next-mdx-remote/rsc"


Code.theme = {
    light: 'github-light',
    dark: 'github-dark',
    lightSelector: 'html.light',
}

export const Preview = async ({ content = "" }: { content?: string }) => {
    const safeContent = typeof content === "string" ? content : "";
    const formattedContent = safeContent.replace(/\\/g, "").replace(/&#x20;/g, "");

    return (
        <section className="markdown prose grid break-words">
            <MDXRemote
                source={formattedContent}
                components={{
                    pre: (props) => (
                        <Code
                            {...props}
                            lineNumbers
                            className="shadow-light-200 dark:shadow-dark-200"
                        />
                    ),
                }}
            />
        </section>
    );
};