import Image from 'next/image'
import classes from './page.module.css'
import { getMeal } from '@/lib/meals'
import { notFound } from 'next/navigation'

type MealDetailsPageProps = {
  params: {
    slug?: string
  }
}

export async function generateMetadata({ params }: MealDetailsPageProps) {
  const meal = getMeal(params?.slug || '')

  if (!meal) {
    return {
      status: 404,
      title: 'Not Found',
    }
  }

  return {
    title: meal.title,
    description: meal.summary,
  }
}

export default function MealDetailsPage({ params }: MealDetailsPageProps) {
  if (!params?.slug) {
    return notFound()
  }

  const meal = getMeal(params.slug)

  if (!meal) {
    return notFound()
  }

  const instructions = meal.instructions.replace(/\n/g, '<br />')

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://sas-foodies-app.s3.eu-north-1.amazonaws.com/${meal.image}`}
            alt="Meal image"
            fill
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p className={classes.instructions} dangerouslySetInnerHTML={{ __html: instructions }}></p>
      </main>
    </>
  )
}
