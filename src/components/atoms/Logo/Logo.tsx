import logoImage from '@/assets/logo.jpeg'
import styles from './Logo.module.css'

interface LogoProps {
  size?: 'lg' | 'md' | 'sm'
}

export function Logo({ size = 'lg' }: LogoProps) {
  return <img src={logoImage} alt="Pollo Charly" className={`${styles.logo} ${styles[size]}`} />
}
