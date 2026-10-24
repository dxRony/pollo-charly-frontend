import styles from './SiteFooter.module.css'

const PHONE_DISPLAY = '(502) 77650852'
const PHONE_DIGITS = '50277650852'
const FACEBOOK_URL = 'https://www.facebook.com/share/1K98bQbPWH/'

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.title}>📍 Contáctanos</h2>
      <p className={styles.row}>
        📞 Teléfono y WhatsApp:{' '}
        <a className={styles.link} href={`tel:+${PHONE_DIGITS}`}>
          {PHONE_DISPLAY}
        </a>
      </p>
      <p className={styles.row}>📍 4 Calle 21-04 Zona 1, Quetzaltenango, Guatemala</p>
      <p className={styles.rowStrong}>🕗 Horario: Lunes a Domingo 8:00 AM - 6:00 PM</p>
      <p className={styles.actions}>
        <a
          className={styles.action}
          href={`https://wa.me/${PHONE_DIGITS}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Escribir por WhatsApp
        </a>
        <a className={styles.action} href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          👍 Síguenos en Facebook
        </a>
      </p>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} Charly Pollo Frito - 100% Súper Chivo. Todos los derechos
        reservados.
      </p>
    </footer>
  )
}
