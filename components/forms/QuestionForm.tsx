"use client"

import React, { useRef, useTransition } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AskQuestionSchema } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import { z } from 'zod';
import TagCard from '../cards/TagCard';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/routes';
import {ReloadIcon} from '@radix-ui/react-icons';
import { Question } from '@/types/global';

const Editor = dynamic(() => import('@/components/editor/index'), {
  // Make sure we turn SSR off
  ssr: false
})

interface QuestionFormParams {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({question, isEdit=false}: QuestionFormParams) => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  console.log(question?.tags, isEdit)


  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map(tag => tag.name) || []
    }
  })

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    console.log(field, e);
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  }

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "At least one tag is required"
      })
    }
  }

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {

    startTransition(async () => {

      if(isEdit && question) {
        const result = await editQuestion({questionId: question?._id, ...data})

        if(result.success) {
          toast({
            title: "Success",
            description: "Question Updated Successfully"
          });

          if (result.data) router.push(ROUTES.QUESTION(result.data._id))
        } else {
          toast({
            title: `Error ${result.status}`,
            description: result.error?.message || "Something went wrong",
            variant: "destructive"
          })
        }

        return;
      }

      const result = await createQuestion(data);
      if (result.success) {
        toast({
          title: "Question Created",
          description: "Your question has been created successfully",
        });


        // TODO: Fix this type issue for result.data._id
        if (result.data && typeof result.data === 'object' && '_id' in result.data) {
          router.push(ROUTES.QUESTION((result.data as { _id: string })._id));
        }
        else {
          toast({
            title: "Error: Question Creation Failed",
            description: result.error?.message || "Your question has not been created",
            variant: "destructive",
          });

        }

      }
    })

  }

  return (
    <Form {...form}>
      <form className={`flex w-full flex-col gap-10`} onSubmit={form.handleSubmit(handleCreateQuestion)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className={`flex w-full flex-col`}>
              <FormLabel className={`paragraph-semibold text-dark400_light800`}>Question Title <span className={`text-primary-500`}>*</span></FormLabel>
              <FormControl>
                <Input
                  className={`paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border`}
                  {...field}
                />
              </FormControl>

              <FormDescription className={`text-light-500.5`}>
                Be specific and imagine you&apos;re asking a question to another person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className={`flex w-full flex-col`}>
              <FormLabel className={`paragraph-semibold text-dark400_light800`}>Detailed Explanation of your problem <span className={`text-primary-500`}>*</span></FormLabel>
              <FormControl>
                <Editor editorRef={editorRef} value={field.value} fieldChange={field.onChange} />
              </FormControl>

              <FormDescription className={`text-light-500.5`}>
                Introduce the problem an expand on what you&apos;ve put in the title
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className={`flex w-full flex-col`}>
              <FormLabel className={`paragraph-semibold text-dark400_light800`}>Tags<span className={`text-primary-500`}>*</span></FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field?.value?.map((tag: string, i) => (
                        <TagCard
                          key={i}
                          _id={tag}
                          name={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>

              <FormDescription className={`text-light-500.5`}>
                Add upto 5 tags to describe what your question is about. You need to press enter to add a tag
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />



        <div className={`mt-16 flex justify-end`}>
          <Button type="submit" className={`primary-gradient !text-light-900 w-fit`} disabled={isPending}>
            {isPending ? <>
              <ReloadIcon className={`mr-2 h-4 w-4 animate-spin`} /> 
              <span>Submitting</span>
            </>
            :
            <>
            {isEdit ? "Edit" : "Ask a Question"}
            </>
            }
            </Button>
        </div>
      </form>
    </Form>
  )
}

export default QuestionForm;