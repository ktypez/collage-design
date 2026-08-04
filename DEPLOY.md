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
