import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Stagger delay in ms */
  delay?: number
}

/** Fades and lifts its children in once they scroll into view. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()
  const style: CSSProperties = { transitionDelay: inView ? `${delay}ms` : '0ms' }

  return (
    <Tag
      ref={ref}
      style={style}
      className={`transition duration-700 ease-out motion-reduce:transform-none motion-reduce:opacity-100 ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
