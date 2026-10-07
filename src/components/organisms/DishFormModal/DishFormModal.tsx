import { useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
import { ImageUploadField } from '@/components/molecules/ImageUploadField'
import { SelectField } from '@/components/molecules/SelectField'
import { TextareaField } from '@/components/molecules/TextareaField'
import { Modal } from '@/components/molecules/Modal'
import { SupplyQuantityPicker, type SupplyQuantityLine } from '@/components/organisms/SupplyQuantityPicker'
import { ComplementPicker } from '@/components/organisms/ComplementPicker'
import type { Category } from '@/types/category'
import type { Supply } from '@/types/supply'
import type { Complement } from '@/types/complement'
import type { CreateDishPayload, Dish, DishRecipeInput, UpdateDishPayload } from '@/types/dish'
import styles from './DishFormModal.module.css'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024

interface DishFormModalProps {
  mode: 'create' | 'edit'
  categories: Category[]
  availableSupplies: Supply[]
  availableComplements: Complement[]
  initialDish?: Dish
  onClose: () => void
  onSubmit: (payload: CreateDishPayload | UpdateDishPayload) => Promise<void>
  onUploadImage: (image: File) => Promise<string>
  onDiscardImage: (imageUrl: string) => void
}

export function DishFormModal({
  mode,
  categories,
  availableSupplies,
  availableComplements,
  initialDish,
  onClose,
  onSubmit,
  onUploadImage,
  onDiscardImage,
}: DishFormModalProps) {
  const [name, setName] = useState(initialDish?.name ?? '')
  const [categoryId, setCategoryId] = useState<number | ''>(initialDish?.category_id ?? '')
  const [description, setDescription] = useState(initialDish?.description ?? '')
  const [price, setPrice] = useState(initialDish?.price.toString() ?? '')
  const [imageUrl, setImageUrl] = useState<string | null>(initialDish?.image_url ?? null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  // Imagen subida en esta sesión que todavía no se guardó con el platillo: si se reemplaza, se quita
  // o se cierra el formulario sin guardar, hay que descartarla para no dejar archivos huérfanos.
  const unsavedUploadRef = useRef<string | null>(null)
  const [recipeLines, setRecipeLines] = useState<SupplyQuantityLine[]>(
    initialDish?.recipes.map((line) => ({
      supply_id: line.supply_id,
      required_quantity: line.required_quantity.toString(),
    })) ?? [],
  )
  const [complementIds, setComplementIds] = useState<number[]>(
    initialDish?.complements.map((complement) => complement.id) ?? [],
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const title = mode === 'create' ? 'Registrar nuevo platillo' : 'Editar platillo'

  function discardUnsavedUpload() {
    if (unsavedUploadRef.current) {
      onDiscardImage(unsavedUploadRef.current)
      unsavedUploadRef.current = null
    }
  }

  function handleClose() {
    discardUnsavedUpload()
    onClose()
  }

  function handleRemoveImage() {
    discardUnsavedUpload()
    setImageUrl(null)
  }

  async function handleSelectImage(file: File) {
    setImageError(null)

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError('La imagen debe ser un archivo JPG, PNG o WebP.')
      return
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('La imagen no puede superar los 2 MB.')
      return
    }

    setIsUploadingImage(true)

    try {
      const uploadedUrl = await onUploadImage(file)
      discardUnsavedUpload()
      unsavedUploadRef.current = uploadedUrl
      setImageUrl(uploadedUrl)
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'No se pudo subir la imagen.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (categoryId === '') {
      setError('Debes seleccionar una categoría.')
      return
    }

    const recipes: DishRecipeInput[] = []

    for (const line of recipeLines) {
      const hasQuantity = line.required_quantity.trim() !== ''

      if (line.supply_id === '' && !hasQuantity) {
        continue
      }

      if (line.supply_id === '' || !hasQuantity) {
        setError('Cada insumo de la receta debe tener seleccionado un insumo y una cantidad.')
        return
      }

      const quantity = Number(line.required_quantity)

      if (Number.isNaN(quantity) || quantity <= 0) {
        setError('La cantidad de cada insumo de la receta debe ser un número mayor a 0.')
        return
      }

      recipes.push({ supply_id: line.supply_id, required_quantity: quantity })
    }

    const payload: CreateDishPayload | UpdateDishPayload = {
      name,
      category_id: categoryId,
      description: description || undefined,
      price: Number(price),
      image_url: imageUrl,
      recipes,
      complements: complementIds,
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
      unsavedUploadRef.current = null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el platillo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <FormField
          id="name"
          label="Nombre"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <SelectField
          id="category_id"
          label="Categoría"
          value={categoryId}
          onChange={(event) =>
            setCategoryId(event.target.value === '' ? '' : Number(event.target.value))
          }
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectField>
        <TextareaField
          id="description"
          label="Descripción (opcional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
        <FormField
          id="price"
          label="Precio de venta"
          type="number"
          step="0.01"
          min="0.01"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          required
        />
        <ImageUploadField
          id="dish_image"
          label="Imagen (opcional)"
          imageUrl={imageUrl}
          isUploading={isUploadingImage}
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          hint="JPG, PNG o WebP de hasta 2 MB."
          error={imageError ?? undefined}
          onSelectFile={handleSelectImage}
          onRemove={handleRemoveImage}
        />
        <SupplyQuantityPicker
          availableSupplies={availableSupplies}
          lines={recipeLines}
          onChange={setRecipeLines}
        />
        <ComplementPicker
          availableComplements={availableComplements}
          selectedIds={complementIds}
          onChange={setComplementIds}
        />
        {error && <p className={styles.formError}>{error}</p>}
        <div className={styles.actions}>
          <Button type="button" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting || isUploadingImage}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
