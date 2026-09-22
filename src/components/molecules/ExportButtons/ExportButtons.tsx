import { Button } from '@/components/atoms/Button'
import styles from './ExportButtons.module.css'

interface ExportButtonsProps {
  onExportPdf: () => void
  onExportExcel: () => void
  isExporting: boolean
}

export function ExportButtons({ onExportPdf, onExportExcel, isExporting }: ExportButtonsProps) {
  return (
    <div className={styles.wrapper}>
      <Button type="button" size="sm" onClick={onExportPdf} disabled={isExporting}>
        {isExporting ? 'Exportando...' : '📄 Exportar PDF'}
      </Button>
      <Button type="button" size="sm" onClick={onExportExcel} disabled={isExporting}>
        {isExporting ? 'Exportando...' : '📊 Exportar Excel'}
      </Button>
    </div>
  )
}
