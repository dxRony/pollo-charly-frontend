import styles from './LoadingMessage.module.css'

interface LoadingMessageProps {
  message: string
}

export function LoadingMessage({ message }: LoadingMessageProps) {
  return (
    <p className={styles.message} role="status">
      {message}
    </p>
  )
}
