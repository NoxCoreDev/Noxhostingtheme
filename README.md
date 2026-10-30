# NOX HOSTING

**NOX HOSTING** is a blue, black and white theme for the Pterodactyl Panel (v1.15.2).

**Created by NoxCoreDev**.
Design, logo, color palette and theme changes: © 2026 NoxCoreDev.

## Author

- **Name:** NoxCoreDev
- **Theme:** NOX HOSTING
- **Footer credit:** "NOX HOSTING by NoxCoreDev" (must be kept)

## What this repository changes

This repository contains only the files changed from the upstream Pterodactyl
Panel 1.15.2 source:

- `tailwind.config.js`: NOX HOSTING color palette (blue, black, white)
- `config/app.php`: default application name set to NOX HOSTING
- `resources/scripts/components/auth/LoginFormContainer.tsx`: login page and footer
- `resources/scripts/components/NavigationBar.tsx`: top bar and active tab color
- `resources/scripts/components/elements/GreyRowBox.tsx`: dark navy cards
- `resources/views/templates/wrapper.blade.php`: page title and link preview tags
- `public/assets/svgs/nox-hosting.svg`: NOX HOSTING logo
- `public/assets/nox/preview.png`: link preview image (1200x630)

`nox-hosting-changes.patch` lists every changed line.

## Installing

Install a Pterodactyl Panel 1.15.2 first, then apply the NOX HOSTING Panel
archive (`nox-hosting-panel.tar.gz`) over it. Back up your panel and database
before any update.

## License

- NOX HOSTING changes: see `LICENSE-NOX-HOSTING.md` (© 2026 NoxCoreDev).
- Pterodactyl and Laravel code keep their original MIT licenses, see `NOTICE.md`.
