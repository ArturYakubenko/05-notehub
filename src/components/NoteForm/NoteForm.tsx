import type { FC } from "react";
import { Formik, Form, Field, ErrorMessage, } from "formik";
import type {FormikHelpers} from "formik"
import * as Yup from "yup";
import css from "./NoteForm.module.css";

// Тип для поля "tag"
export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

// Тип значений формы
interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}


interface NoteFormProps {
  addNote: (note: NoteFormValues) => void;
  openModal: () => void;
}


const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов’язкове поле"),

  content: Yup.string().max(500, "Максимум 500 символів"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Невірний тег")
    .required("Обов’язкове поле"),
});

const NoteForm: FC<NoteFormProps> = ({ addNote, openModal }) => {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={validationSchema}
      onSubmit={(values: NoteFormValues, actions: FormikHelpers<NoteFormValues>) => {
        addNote(values);      
        openModal();           
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
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

        
          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={openModal}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;