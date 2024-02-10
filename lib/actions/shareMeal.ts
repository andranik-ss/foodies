'use server'

import { redirect } from 'next/navigation'
import { saveMeal } from '../meals'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const mealSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required!',
    })
    .min(3, 'Title must be at least 3 characters long!')
    .max(50, 'Title must be at most 50 characters long!'),
  summary: z
    .string({
      required_error: 'Summary is required!',
    })
    .min(3, 'Summary must be at least 3 characters long!')
    .max(100, 'Summary must be at most 100 characters long!'),
  instructions: z
    .string({
      required_error: 'Instructions are required!',
    })
    .min(3, 'Instructions must be at least 3 characters long!')
    .max(2000, 'Instructions must be at most 2000 characters long!'),
  image: z
    .custom<File>()
    .refine(file => file?.size !== 0, 'Image is required!')
    .refine(file => file?.size <= MAX_FILE_SIZE, 'Max image size is 5MB.')
    .refine(
      file => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.',
    ),
  creator: z
    .string({
      required_error: 'Creator is required!',
    })
    .min(3, 'Name must be at least 3 characters long!')
    .max(50, 'Name must be at most 50 characters long!'),
  creator_email: z
    .string({
      required_error: 'Email is required!',
    })
    .email({
      message: 'Invalid email address!',
    }),
})

type ErrorState = {
  title?: string | string[]
  summary?: string | string[]
  instructions?: string | string[]
  image?: string | string[]
  creator?: string | string[]
  creator_email?: string | string[]
}

export type ShareMealActionState = {
  errors: ErrorState | null
}

export async function shareMeal(
  prevState: ShareMealActionState,
  formData: FormData,
): Promise<ShareMealActionState> {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  }

  const validatedMeal = mealSchema.safeParse(meal)
  if (!validatedMeal.success) {
    return {
      errors: validatedMeal.error.flatten().fieldErrors,
    }
  }

  await saveMeal(validatedMeal.data)
  revalidatePath('/meals')
  redirect('/meals')
}
