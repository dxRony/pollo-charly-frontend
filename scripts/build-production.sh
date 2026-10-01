#!/usr/bin/env bash
# Compila el frontend para producción. CloudFront sirve la web y la API bajo el mismo dominio,
# por eso la API y el endpoint de autenticación del WebSocket son rutas relativas.
# Variables requeridas: VITE_REVERB_HOST, VITE_REVERB_APP_KEY
# Requisito: dependencias instaladas (npm ci).
set -euo pipefail

: "${VITE_REVERB_HOST:?Falta VITE_REVERB_HOST (dominio de CloudFront, sin https://)}"
: "${VITE_REVERB_APP_KEY:?Falta VITE_REVERB_APP_KEY (clave pública de Reverb)}"

cd "$(dirname "${BASH_SOURCE[0]}")/.."

export VITE_API_URL="/api"
export VITE_BACKEND_URL=""
export VITE_REVERB_PORT="443"
export VITE_REVERB_SCHEME="https"

npm run build

echo "Compilación lista en dist/ ($(du -sh dist | cut -f1))"
