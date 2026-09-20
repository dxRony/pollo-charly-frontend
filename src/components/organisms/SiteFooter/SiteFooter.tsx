import styles from './SiteFooter.module.css'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>📍 Contáctanos</h2>
      <p className={styles.row}>
        📞 Teléfono: (502) 77650852 &nbsp;|&nbsp; 📱 WhatsApp: (502) XXXXXXXX &nbsp;|&nbsp; ✉️
        Email: email@pollocharly.com
      </p>
      <p className={styles.row}>📍 4 Calle 21-04 Zona 1, Quetzaltenango, Guatemala</p>
      <p className={styles.rowStrong}>🕗 Horario: Lunes a Domingo 8:00 AM - 6:00 PM</p>
      <p className={styles.row}>
        Facebook: /Pollo Frito Charly &nbsp;|&nbsp; Instagram: @cuentaIG &nbsp;|&nbsp; TikTok:
        @cuentatiktok
      </p>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Charly Pollo Frito - 100% Súper Chivo. Todos los derechos
        reservados.
      </p>
    </footer>
  )
}
