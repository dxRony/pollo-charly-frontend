import styles from './KpiCard.module.css'

interface KpiCardProps {
  label: string
  value: string
  icon?: string
}

export function KpiCard({ label, value, icon }: KpiCardProps) {
  return (
    <div className={styles.card}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
