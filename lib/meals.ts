import fs from 'fs'

import sql from 'better-sqlite3'
import slugify from 'slugify'
import xss from 'xss'
import { S3 } from '@aws-sdk/client-s3'

import { Meal, MealDto } from './types'
import { uploadImage } from './google-drive.backup'

const s3 = new S3({
  region: 'eu-north-1',
})
const db = sql('meals.db')

export async function getMeals(): Promise<MealDto[]> {
  // await new Promise((resolve) => setTimeout(resolve, 5000))
  // throw new Error('Failed to fetch meals')
  const meals = db.prepare('SELECT * FROM meals').all() as unknown as MealDto[]
  return meals
}

export function getMeal(slug: string): MealDto {
  const meal = db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug) as unknown as MealDto
  return meal
}

export async function saveMeal(meal: Meal): Promise<void> {
  const { title, summary, image, creator, creator_email } = meal
  const slug = slugify(title, { lower: true })
  const instructions = xss(meal.instructions)

  const extension = image.name.split('.').pop()
  const fileName = `${slug}.${extension}`

  const bufferedImage = await image.arrayBuffer()

  s3.putObject({
    Bucket: 'sas-foodies-app',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  })

  db.prepare(
    'INSERT INTO meals (title, slug, image, summary, creator, creator_email, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(title, slug, fileName, summary, creator, creator_email, instructions)
}
