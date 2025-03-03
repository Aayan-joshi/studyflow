import React from 'react'
import QuestionForm from "@/components/forms/QuestionForm";

const AskQuestion = () => {
    return (
        <div>
            <div className={`h1-bold text-dark100_light900`}>
                Ask a question
            </div>
            <div className={`mt-9`}>
                <QuestionForm />
            </div>

        </div>
    )
}
export default AskQuestion
