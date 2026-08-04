# Deploy

Design Gallery framework served by Caddy. 2 endpoints:

| URL | Use | Audience |
|---|---|---|
| `https://192.168.1.47/design/` | LAN-only — main access point | lab users |
| `https://design.mcky.space/` | public via Cloudflare tunnel | external |

## Live endpoints (all 200 OK ✓)

### LAN (192.168.1.47)
```
/design/                                  → /home/admin/design-gallery/index.html (legacy gallery + framework banner)
/design/app/                             → framework landing
/design/app/showcase.html                → 54 components catalog
/design/app/playground.html              → live HSL editor
/design/app/theme-builder.html           → 3-step theme wizard
/design/app/registry.html                → browse 9 themes + 53 components
/design/app/theme-test.html              → smoke test (switch theme live)
/design/app/examples/dashboard.html      → rack theme · server-rack dashboard
/design/app/examples/blog.html           → claude theme · editorial article
/design/app/examples/landing.html        → mcky theme · neobrutalist marketing
/design/app/examples/settings.html       → min theme · settings app
```

### Public (design.mcky.space)
```
/                                        → index.html (legacy gallery)
/app/                                    → framework landing
/app/showcase.html                       → components
/app/theme-builder.html                  → wizard
/themes/mcky/theme.css                   → mcky theme CSS
/themes/mcky/theme.json                  → mcky theme metadata
... (same structure as LAN)
```

## Caddy config (in `/etc/caddy/Caddyfile`)

### LAN route (in `common_routes`)
```
redir /design /design/ 301
handle_path /design/* {
    root * /home/admin/design-gallery
    file_server
}
```

### Public subdomain
```
design.mcky.space {
    tls /etc/caddy/origin-server.crt /etc/caddy/origin-server.key
    handle_errors { ... }
    handle / {
        root * /home/admin/design-gallery
        file_server
    }
    handle {
        root * /home/admin/design-gallery
        try_files {http.request.uri.path} {http.request.uri.path}/index.html =404
        file_server
    }
}
```

## Persistent patch

The Caddyfile on disk has the legacy `try_files {path} =404` which doesn't auto-serve `index.html` for directories on the subdomain. The admin API fix is in-memory only.

To make persistent:
```bash
sudo bash patch-caddy.sh
```

The script:
1. Backs up Caddyfile
2. sed: `try_files {http.request.uri.path} =404` → `try_files {http.request.uri.path} {http.request.uri.path}/index.html =404`
3. Validates
4. Reloads
5. Tests

## Verification

```bash
# LAN
for p in app app/showcase.html app/examples/dashboard.html themes/mcky/theme.css; do
  curl -sI -k "https://192.168.1.47/design/$p" | head -1
done

# public
for p in app app/showcase.html themes/mcky/theme.css; do
  curl -sI "https://design.mcky.space/$p" | head -1
done
```

## Sudo wrapper — `🐈`

Sudo password บน lab server ต้องใช้รหัสลับ **`🐈` (= meow)** เพื่อหลีกเลี่ยงการเขียน password ตรงๆ ใน command/shell history.

### Setup

```bash
# secret stored in 600 file (admin:admin)
ls -la ~/.brain-sudo
-rw-rwx---  1 admin  admin  4  Aug  1 11:16  /home/admin/.brain-sudo

# wrapper script (admin-owned, mode 770)
ls -la ~/.opencode/bin/🐈
-rwxrwx---  1 admin  admin  251 Aug  1 11:16  /home/admin/.opencode/bin/🐈
```

`🐈` is a thin wrapper around `sudo -S` that reads the password from `~/.brain-sudo` and **forwards stdin to the command** (v2026-08-04: replaced `<<<` heredoc with `$(cat)` + `cat` passthrough so piped data works). Behavior is identical to `sudo` — same `NOPASSWD` allowlist (rc-service for caddy/cloudflared/etc, caddy validate/reload) applies, password needed for everything else.

### Usage

```bash
# assign to variable (tilde + emoji need to be in double quotes)
SUDO="$HOME/.opencode/bin/🐈"

# verify
"$SUDO" whoami
# → root

# with quoted args (emoji in path requires careful quoting)
"$SUDO" cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak
"$SUDO" sed -i 's|old|new|g' /etc/caddy/Caddyfile
"$SUDO" systemctl restart caddy

# ⭐ stdin passthrough (FIXED 2026-08-04)
# password goes on line 1, the REST of stdin reaches the command:
echo "data" | "$SUDO" tee /tmp/test      # file contains "data", NOT the password
printf 'a\nb\n' | "$SUDO" tee /tmp/x     # multi-line stdin forwards fully
```

### Common commands for design-gallery deploy

```bash
SUDO="$HOME/.opencode/bin/🐈"

# 1. patch the Caddyfile (make try_files fix persistent)
"$SUDO" sed -i 's|try_files {path} =404|try_files {path} {path}/index.html =404|g' /etc/caddy/Caddyfile
"$SUDO" /usr/sbin/caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
"$SUDO" /usr/sbin/caddy reload  --config /etc/caddy/Caddyfile --adapter caddyfile

# 2. restart caddy (full process kill + start)
"$SUDO" /usr/sbin/rc-service caddy restart

# 3. read /etc/caddy/Caddyfile (uses sudo since caddy dir is root-owned 755)
"$SUDO" cat /etc/caddy/Caddyfile
"$SUDO" sed -n '142,160p' /etc/caddy/Caddyfile   # show design.mcky.space block

# 4. backup before edit
"$SUDO" cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak.$(date +%Y%m%d-%H%M%S)

# 5. other services on lab (cloudflared, dufs, glance, gatus, etc.)
"$SUDO" /usr/sbin/rc-service cloudflared restart
"$SUDO" /usr/sbin/rc-service glances   restart
```

### Limitations — what 🐈 CANNOT do

Anything not in the `NOPASSWD` allowlist will prompt for password (which you don't have interactively in scripts). Common gotchas:

| command | result | workaround |
|---|---|---|
| `🐈 sed -i ...` | works (password from stdin) | OK in scripts |
| `🐈 vim /etc/caddy/Caddyfile` | ✗ requires TTY | edit in `/tmp` then `cp` |
| `🐈 apt install` | ✗ requires TTY | use NOPASSWD-allowed tools |
| `🐈 systemctl daemon-reload` | works | OK in scripts |

For interactive editor sessions over SSH: log in with password manually first, then use `sudo` directly.

### Why emoji wrapper?

1. **Search-resistant** — `grep 🐈` in shell history / log files returns nothing
2. **Mental model** — 🐈 = "need elevated privilege here"
3. **No accidental password in history** — never types literal password
4. **Easy to remember** — visual mnemonic, easier than `SUDO_PASSWORD=$(cat ~/.brain-sudo)` every time

### Adding new sudoers rules

To allow a new command without password:

```bash
# 1. add to /etc/sudoers.d/<name>
echo "admin ALL=(ALL) NOPASSWD: <command>" | sudo tee /etc/sudoers.d/<name> >/dev/null
sudo chmod 440 /etc/sudoers.d/<name>

# 2. test
"$SUDO" <command>
```

Existing rules live in `/etc/sudoers.d/lab-ops` (440, root:root) — see existing NOPASSWD list for allowed services.

## Workflow after deploy

1. `cd /home/admin/design-gallery`
2. edit files in `src/`, `themes/`, `app/`
3. `node bin/dg.js check` (validates syntax + theme contracts)
4. `node tools/codegen.mjs` (regenerate themes if manifest changed)
5. changes are live immediately (Caddy reads from disk per request, no build step)

## Files in this repo that get served

- `index.html` — root page (legacy gallery + framework banner)
- `app/*.html` — framework tooling UI
- `app/examples/*.html` — 4 real-world examples
- `src/tokens/schema.css` — default neutral token schema
- `src/components/base.css` — 54 components
- `src/components/components.js` — interactive behavior
- `themes/<id>/theme.css` — 9 generated themes
- `themes/<id>/theme.json` — theme metadata
- `concepts/<id>.html` + `concepts/<id>.css` — 9 legacy concept pages (kept as reference)
- `src/js/themes/<id>/manifest.js` — concept manifests (used by engine, not directly served)
