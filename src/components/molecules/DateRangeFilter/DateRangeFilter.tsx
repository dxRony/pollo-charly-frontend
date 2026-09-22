import { TextInput } from '@/components/atoms/TextInput'
import styles from './DateRangeFilter.module.css'

interface DateRangeFilterProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}

export function DateRangeFilter({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DateRangeFilterProps) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.field}>
        <span className={styles.label}>Desde</span>
        <TextInput type="date" value={dateFrom} onChange={(event) => onDateFromChange(event.target.value)} />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>Hasta</span>
        <TextInput type="date" value={dateTo} onChange={(event) => onDateToChange(event.target.value)} />
      </label>
    </div>
  )
}
