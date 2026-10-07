import { useState } from 'react'
import { Modal } from '@/components/molecules/Modal'
import styles from './DishImageModal.module.css'

interface DishImageModalProps {
  dishName: string
  imageUrl: string
  onClose: () => void
}

export function DishImageModal({ dishName, imageUrl, onClose }: DishImageModalProps) {
  const [hasFailed, setHasFailed] = useState(false)

  return (
    <Modal title={dishName} onClose={onClose}>
      {hasFailed ? (
        <p className={styles.error} role="alert">
          No se pudo cargar la imagen. Verifica tu conexión o vuelve a subirla.
        </p>
      ) : (
        <img
          src={imageUrl}
          alt={`Imagen de ${dishName}`}
          className={styles.image}
          onError={() => setHasFailed(true)}
        />
      )}
    </Modal>
  )
}
