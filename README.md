# NOX HOSTING Theme

Theme bleu, noir et blanc pour Pterodactyl, par NoxCoreDev.

## Contenu
- `conf.yaml` : manifeste Blueprint (nom, version, fichiers injectés)
- `nox-theme.css` : couleurs bleu, noir et blanc
- `assets/logo.svg` : logo NOX HOSTING (page de connexion)
- `assets/preview.png` : image d'aperçu des liens (1200x630)

## Prérequis
- Pterodactyl 1.x avec Blueprint installé
- VPS avec au moins 2 Go de RAM (la compilation échoue sur moins)

## Installation
Sur le Panel, avec Blueprint :
    blueprint -install noxhosting-theme
Pour désinstaller :
    blueprint -remove noxhosting-theme

## Statut
Version 1.0.0, non testée sur un Panel réel. Vérifier l'affichage après installation.
