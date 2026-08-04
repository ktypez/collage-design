#!/bin/bash
# =============================================================================
# patch-caddy.sh — make subdomain fix persistent in /etc/caddy/Caddyfile
# -----------------------------------------------------------------------------
# Run with: sudo bash patch-caddy.sh
# (or admin can edit manually)
#
# WHY: the caddy admin API can fix design.mcky.space/app/ in-memory, but
# /etc/caddy/Caddyfile still has the old config. If caddy restarts, the
# 404 returns. This script updates the Caddyfile to match the running config.
# =============================================================================

set -e

CONF=/etc/caddy/Caddyfile

if [[ ! -f "$CONF" ]]; then
  echo "ERROR: $CONF not found"
  exit 1
fi

# backup
cp "$CONF" "$CONF.bak.$(date +%Y%m%d-%H%M%S)"

# Fix: change `try_files {path} =404` to `try_files {path} {path}/index.html =404`
# in the design.mcky.space block
sudo sed -i 's|try_files {http.request.uri.path} =404|try_files {http.request.uri.path} {http.request.uri.path}/index.html =404|g' "$CONF"

# Alternative: also support `{path}` shorthand if it ever appears
sudo sed -i 's|try_files {path} =404|try_files {path} {path}/index.html =404|g' "$CONF"

echo "=== Patched design.mcky.space block ==="
sudo sed -n '142,160p' "$CONF"

echo
echo "=== Validating ==="
sudo /usr/sbin/caddy validate --config "$CONF" --adapter caddyfile

echo
echo "=== Reloading ==="
sudo /usr/sbin/caddy reload --config "$CONF" --adapter caddyfile

echo
echo "=== Test ==="
echo "  design.mcky.space/app/ : $(curl -s -o /dev/null -w 'HTTP %{http_code}' https://design.mcky.space/app/)"
echo "  design.mcky.space/    : $(curl -s -o /dev/null -w 'HTTP %{http_code}' https://design.mcky.space/)"
echo
echo "Done. Fix is now persistent."
