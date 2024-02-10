'use client'

import { useFormState } from 'react-dom'
import { ImagePicker } from '@/components/meals'
import { shareMeal, ShareMealActionState } from '@/lib/actions/shareMeal'

import classes from './page.module.css'
import { FormInput } from '@/components/form-input'

const initialState: ShareMealActionState = {
  errors: null,
}

export default function ShareMealPage() {
  const [state, formAction] = useFormState(shareMeal, initialState)

  const { errors } = state

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <div className={classes.row}>
            <FormInput
              component="input"
              label="Your name"
              name="name"
              required
              type="text"
              error={errors?.creator?.[0]}
            />
            <FormInput
              component="input"
              label="Your email"
              name="email"
              required
              type="email"
              error={errors?.creator_email?.[0]}
            />
          </div>
          <FormInput
            component="input"
            label="Title"
            name="title"
            required
            type="text"
            error={errors?.title?.[0]}
          />
          <FormInput
            component="input"
            label="Short Summary"
            name="summary"
            required
            type="text"
            error={errors?.summary?.[0]}
          />
          <FormInput
            component="textarea"
            label="Instructions"
            name="instructions"
            required
            rows={10}
            error={errors?.instructions?.[0]}
          />
          <ImagePicker label="Meal Image" name="image" error={errors?.image?.[0]} />
          <div>
            <p className={classes.actions}>
              <button type="submit">Share Meal</button>
            </p>
          </div>
        </form>
      </main>
    </>
  )
}
