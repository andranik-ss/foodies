export type Meal = {
  title: string
  image: File
  summary: string
  creator: string
  creator_email: string
  instructions: string
}

export type MealDto = {
  id: string
  title: string
  slug: string
  image: string
  summary: string
  creator: string
  creator_email: string
  instructions: string
}
