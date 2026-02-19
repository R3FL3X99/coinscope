import type { HTMLAttributes } from 'react'
import { cn } from '../utils/classnames'

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5',
        className,
      )}
      {...props}
    />
  )
}
