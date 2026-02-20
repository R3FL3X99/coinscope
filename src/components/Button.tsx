import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../utils/classnames'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  children: ReactNode
  to?: string
  variant?: ButtonVariant
  disabled?: boolean
}

const baseButtonClasses =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:pointer-events-none disabled:opacity-60'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100',
  danger:
    'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:text-rose-800 focus-visible:ring-rose-200',
}

export function Button(props: ButtonProps) {
  const { to, variant = 'primary', className, children, type = 'button', disabled, ...rest } = props

  if (typeof to === 'string') {
    return (
      <Link
        to={disabled ? '#' : to}
        aria-disabled={disabled}
        className={cn(baseButtonClasses, variantClasses[variant], disabled && 'pointer-events-none opacity-60', className)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(baseButtonClasses, variantClasses[variant], className)}
      {...rest}
    >
      {children}
    </button>
  )
}
