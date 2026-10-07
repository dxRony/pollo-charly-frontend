import { useRef, type ChangeEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FieldLabel } from '@/components/atoms/FieldLabel'
import styles from './ImageUploadField.module.css'

interface ImageUploadFieldProps {
  id: string
  label: string
  imageUrl: string | null
  isUploading: boolean
  accept: string
  hint?: string
  error?: string
  onSelectFile: (file: File) => void
  onRemove: () => void
}

export function ImageUploadField({
  id,
  label,
  imageUrl,
  isUploading,
  accept,
  hint,
  error,
  onSelectFile,
  onRemove,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    // Permite volver a elegir el mismo archivo después de un error o de quitar la imagen.
    event.target.value = ''

    if (file) {
      onSelectFile(file)
    }
  }

  return (
    <div className={styles.field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {imageUrl && <img src={imageUrl} alt="Vista previa" className={styles.preview} />}
      <div className={styles.actions}>
        <Button
          type="button"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? 'Subiendo...' : imageUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Button>
        {imageUrl && !isUploading && (
          <Button type="button" size="sm" onClick={onRemove}>
            Quitar imagen
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        id={id}
        className={styles.fileInput}
        type="file"
        accept={accept}
        onChange={handleChange}
      />
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
