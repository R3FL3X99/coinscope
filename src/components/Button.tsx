import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/classnames'
import type { ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  children: ReactNode
  to?: string
}

const buttonClasses =
  'inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900'

export function Button(props: ButtonProps) {
  const { to, className, children, type = 'button', ...rest } = props

  if (typeof to === 'string') {
    return (
      <Link to={to} className={cn(buttonClasses, className)}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={cn(buttonClasses, className)} {...rest}>
      {children}
    </button>
  )
}
