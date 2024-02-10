import Link from 'next/link'
import Image from 'next/image'

import classes from './meal-item.module.css'

type MealItemProps = Readonly<{
  title: string
  slug: string
  image: string
  summary: string
  creator: string
}>

export function MealItem({
  title,
  slug,
  image,
  summary,
  creator,
}: MealItemProps) {
  return (
    <article className={classes.meal}>
      <header>
        <div className={classes.image}>
          <Image src={`https://sas-foodies-app.s3.eu-north-1.amazonaws.com/${image}`} alt={title} fill />
        </div>
        <div className={classes.headerText}>
          <h2>{title}</h2>
          <p>by {creator}</p>
        </div>
      </header>
      <div className={classes.content}>
        <p className={classes.summary}>{summary}</p>
        <div className={classes.actions}>
          <Link href={`/meals/${slug}`}>View Details</Link>
        </div>
      </div>
    </article>
  )
}
