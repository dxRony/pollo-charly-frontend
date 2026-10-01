#!/usr/bin/env bash
# Publica dist/ en el bucket S3 del frontend e invalida la caché de CloudFront.
# Variables requeridas: FRONTEND_BUCKET, CLOUDFRONT_DISTRIBUTION_ID
set -euo pipefail
export AWS_PAGER=""

: "${FRONTEND_BUCKET:?Falta FRONTEND_BUCKET}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?Falta CLOUDFRONT_DISTRIBUTION_ID}"

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [ ! -f dist/index.html ]; then
  echo "No existe dist/index.html: ejecuta primero scripts/build-production.sh" >&2
  exit 1
fi

aws s3 sync dist/assets "s3://$FRONTEND_BUCKET/assets" \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync dist "s3://$FRONTEND_BUCKET" \
  --exclude "assets/*" \
  --delete \
  --cache-control "public,max-age=300"

aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Status' \
  --output text

echo "Frontend publicado en s3://$FRONTEND_BUCKET"
