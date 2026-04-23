import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export function Card({ children, header, footer, className }: CardProps) {
  return (
    <div className={clsx('bg-gray-900 rounded-lg border border-gray-800', className)}>
      {header && (
        <div className="px-4 py-3 border-b border-gray-800 text-sm font-medium text-gray-300">
          {header}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-800">{footer}</div>
      )}
    </div>
  )
}
