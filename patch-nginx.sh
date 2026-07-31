#!/bin/bash
# Patch nginx config to use index.html as entry point
# Run with: sudo bash patch-nginx.sh
# Server uses openrc (Alpine/postmarketOS) — NOT systemd
set -e

CONF=/etc/nginx/http.d/all-ssl.conf

if [[ ! -f "$CONF" ]]; then
  echo "ERROR: $CONF not found"
  exit 1
fi

# backup
cp "$CONF" "$CONF.bak.$(date +%Y%m%d-%H%M%S)"

# patch: change index + try_files + redirects from preview.html to index.html
# (only in /design/ and /collage/ blocks; sed scopes by context-free replace)
sed -i 's|        index preview.html;|        index index.html;|g' "$CONF"
sed -i 's|        try_files \$uri \$uri/ /design/preview.html;|        try_files \$uri \$uri/ /design/index.html;|g' "$CONF"
sed -i 's|        return 301 /design/preview.html;|        return 301 /design/index.html;|g' "$CONF"
# also patch the /collage/ redirects that pointed to /design/preview.html (already covered above, but explicit)
# (no need — same pattern)

echo "=== Patched /design/ and /collage/ blocks ==="
sudo sed -n '85,108p' "$CONF"

echo ""
echo "=== Testing nginx config ==="
sudo nginx -t

echo ""
echo "=== Reloading nginx (openrc) ==="
sudo rc-service nginx reload

echo ""
echo "Done. Try: curl -sI https://192.168.1.47/design/ | head -3"
