import { useState, type FormEvent } from 'react'
import { Button } from '@/components/atoms/Button'
import { FormField } from '@/components/molecules/FormField'
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

interface DishFormModalProps {
  mode: 'create' | 'edit'
  categories: Category[]
  availableSupplies: Supply[]
  availableComplements: Complement[]
  initialDish?: Dish
  onClose: () => void
  onSubmit: (payload: CreateDishPayload | UpdateDishPayload) => Promise<void>
}

export function DishFormModal({
  mode,
  categories,
  availableSupplies,
  availableComplements,
  initialDish,
  onClose,
  onSubmit,
}: DishFormModalProps) {
  const [name, setName] = useState(initialDish?.name ?? '')
  const [categoryId, setCategoryId] = useState<number | ''>(initialDish?.category_id ?? '')
  const [description, setDescription] = useState(initialDish?.description ?? '')
  const [price, setPrice] = useState(initialDish?.price.toString() ?? '')
  const [imageUrl, setImageUrl] = useState(initialDish?.image_url ?? '')
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
      image_url: imageUrl || undefined,
      recipes,
      complements: complementIds,
    }

    setIsSubmitting(true)

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el platillo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} onClose={onClose}>
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
        <FormField
          id="image_url"
          label="URL de imagen (opcional)"
          type="text"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://..."
        />
        {imageUrl && <img src={imageUrl} alt="Vista previa" className={styles.preview} />}
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
          <Button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
