import { useState } from 'react'
import styles from './PhotoFrame.module.css'

interface PhotoFrameProps {
  src: string | null
  alt: string
  ratio?: 'wide' | 'square'
  placeholder?: string
  className?: string
}

export function PhotoFrame({ src, alt, ratio = 'wide', placeholder = '🍗', className }: PhotoFrameProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = src !== null && src !== failedSrc

  return (
    <div className={[styles.frame, styles[ratio], className].filter(Boolean).join(' ')}>
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className={styles.placeholder} role="img" aria-label={`${alt} (sin imagen)`}>
          {placeholder}
        </span>
      )}
    </div>
  )
}
