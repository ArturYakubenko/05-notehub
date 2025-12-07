import type { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { createNote } from '../../services/noteService.ts'

export const NOTE_TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
export type NoteTag = (typeof NOTE_TAGS)[number];

interface NoteFormValues {
  title: string;
  content?: string;
  tag: NoteTag;
}

interface NoteFormProps {
  closeModal: () => void; 
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов’язкове поле"),

  content: Yup.string().max(500, "Максимум 500 символів"),

  tag: Yup.string()
    .oneOf(NOTE_TAGS, "Невірний тег")
    .required("Обов’язкове поле"),
});

const NoteForm: FC<NoteFormProps> = ({ closeModal }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModal(); 
    },
  });

  return (
    <Formik<NoteFormValues>
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        mutation.mutate(values);
        actions.resetForm();
      }}
    >
      {() => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {NOTE_TAGS.map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={mutation.isPending} 
            >
              {mutation.isPending ? "Saving..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;