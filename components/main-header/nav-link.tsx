'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import classes from './nav-link.module.css'

type NavLinkProps = Readonly<{
  children: React.ReactNode
  href: string
}>

export default function NavLink({ children, href }: NavLinkProps) {
  const path = usePathname()
  return (
    <Link
      href={href}
      className={`${classes.link} ${
        path.startsWith(href) ? classes.active : ''
      }`}
    >
      {children}
    </Link>
  )
}
