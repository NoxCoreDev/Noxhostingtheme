# NOX HOSTING

### Game Server Management Panel

NOX HOSTING is a web control panel for setting up and managing game servers on Linux infrastructure. Administrators manage nodes and users from the Panel; assigned users can manage their servers through the web interface.

The Panel is the management dashboard. Game server processes run on Linux nodes through Docker and **Wings**. Installing the Panel by itself does not install Wings or start game servers.

## How it works

- **NOX HOSTING Panel:** the website administrators and users sign in to.
- **Linux node:** the machine that runs game server containers with Docker and Wings. A node can be a separate server or, for a small setup, the same machine as the Panel if it has enough resources and supports Docker.
- **Domain and HTTPS:** point a domain to the Panel VPS and configure a valid TLS certificate before exposing the Panel publicly.

This project is built for the Pterodactyl Panel **1.15.2** application base and its 1.x Wings setup. The NOX HOSTING frontend assets are included in this repository, so Node.js is not needed for a standard production installation.

> **Release note:** this repository currently has no published GitHub releases. Install from the source repository below, review the source, and pin the commit you deploy. Use this repository—not the upstream Panel's `panel.tar.gz`—to keep the NOX HOSTING changes.

## Requirements

- A fresh Linux VPS with root or `sudo` access. The example below uses Ubuntu 24.04.
- A domain pointed to the Panel VPS. Allow ports 80 and 443 for web access; open only the node allocations and game-service ports you intend to use.
- PHP 8.2 or 8.3 with the required extensions, MariaDB or MySQL, Redis, Nginx (or another supported web server), Git, and Composer 2.
- Docker and Wings on each Linux node that will run game servers. Verify that the VPS provider supports Docker; KVM virtualization is the safest choice.

## Install the Panel on Ubuntu 24.04

The following is a practical new-server installation path. Replace `panel.example.com` and the database password with your own values. Follow the steps one at a time and resolve any errors before continuing.

### 1. Install the system packages

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
  ca-certificates curl git tar unzip composer nginx mariadb-server redis-server \
  php8.3 php8.3-cli php8.3-common php8.3-gd php8.3-mysql php8.3-mbstring \
  php8.3-bcmath php8.3-xml php8.3-curl php8.3-zip php8.3-fpm php8.3-opcache

sudo systemctl enable --now mariadb redis-server nginx php8.3-fpm
```

Check the installed versions with `php -v` and `composer --version`. Use Composer 2; if the Ubuntu package does not provide it, follow the [official Composer installation instructions](https://getcomposer.org/download/). The PHP CLI package supplies core extensions such as PDO, OpenSSL, Tokenizer, and POSIX on Ubuntu.

### 2. Create a database and database user

Open the MariaDB shell:

```bash
sudo mariadb
```

Create a database and a dedicated account. Replace the example password with a unique, long password:

```sql
CREATE DATABASE panel;
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Download NOX HOSTING and install PHP dependencies

```bash
sudo mkdir -p /var/www/pterodactyl
sudo chown "$USER":"$USER" /var/www/pterodactyl
git clone https://github.com/NoxCoreDev/Noxhostingtheme.git /var/www/pterodactyl
cd /var/www/pterodactyl

cp .env.example .env
composer install --no-dev --optimize-autoloader
chmod -R 755 storage/* bootstrap/cache/
```

For a production deployment, check out the reviewed commit you intend to run before completing installation. Back up the database and `.env` before any future upgrade; do not blindly pull new code onto a live server.

### 4. Configure the Panel

Generate the application key **only on a brand-new installation**, then run the interactive setup commands:

```bash
php artisan key:generate --force
php artisan p:environment:setup
php artisan p:environment:database
php artisan p:environment:mail
```

Set the application URL to `https://panel.example.com`. Enter the database name `panel`, username `pterodactyl`, and the password created in step 2. Configure SMTP if you need password resets or system email.

Back up the `APP_KEY` in `.env` together with your database backups. Never regenerate this key on an existing installation: encrypted data may become unreadable.

### 5. Create the tables and administrator account

```bash
php artisan migrate --seed --force
php artisan p:user:make
```

Follow the prompts to create the first administrator account.

### 6. Configure file access, Nginx, and HTTPS

For a standard Ubuntu Nginx installation, set the Panel files to be readable by the web-server account:

```bash
sudo chown -R www-data:www-data /var/www/pterodactyl
```

Configure Nginx to serve `/var/www/pterodactyl/public` through PHP-FPM 8.3 and to use a valid HTTPS certificate for your domain. Follow the [Nginx configuration guide](https://pterodactyl.io/panel/1.0/webserver_configuration.html); create the certificate before enabling an SSL configuration. Confirm that DNS points to the VPS and that ports 80 and 443 are allowed by both the VPS and provider firewalls.

### 7. Enable scheduled tasks and the queue worker

Add the Panel scheduler to root's crontab. Open it with `sudo crontab -e` and add:

```cron
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

Create `/etc/systemd/system/pteroq.service` with these contents:

```ini
[Unit]
Description=NOX HOSTING Panel Queue Worker
After=redis-server.service

[Service]
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable the queue worker:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pteroq.service
```

The Panel should now be reachable at your configured domain. If it does not start, check the Nginx, PHP-FPM, Redis, and queue-worker logs.

## Add game servers with Wings

To run game servers, install Docker and the compatible Wings 1.x service on a Linux node. In the Panel administrator area, create a node, copy its generated Wings configuration to that machine, and start Wings as a system service. Follow the [Wings installation guide](https://pterodactyl.io/wings/1.0/installing.html) and [Panel setup guide](https://pterodactyl.io/panel/1.0/getting_started.html). Make sure Docker works with your VPS provider's virtualization and open the required node and allocation ports.

## Optional: rebuild the frontend

The compiled frontend files are already tracked under `public/assets`; a normal installation does not need a frontend build. For development or frontend changes, use Node.js 22 or newer and Yarn from the repository directory:

```bash
yarn install --frozen-lockfile
yarn build:production
```

## Licensing and notices

The separate [`LICENSE-NOX-HOSTING.md`](./LICENSE-NOX-HOSTING.md) applies to original NOX HOSTING work: its design, artwork, logo, theme, and NOX-authored code. It does **not** replace or relicense inherited or third-party code. The existing [`LICENSE.md`](./LICENSE.md) and [`NOTICE.md`](./NOTICE.md) remain separate and unchanged, preserving the legal notices for the underlying Panel and Laravel code. Other third-party components remain subject to their own applicable licenses. Nothing in this README claims NOX HOSTING authorship of third-party software.

## Documentation

- [Panel installation and configuration](https://pterodactyl.io/panel/1.0/getting_started.html)
- [Nginx web-server configuration](https://pterodactyl.io/panel/1.0/webserver_configuration.html)
- [Wings installation](https://pterodactyl.io/wings/1.0/installing.html)
- [Community support](https://discord.gg/pterodactyl)
- [NOX HOSTING source repository](https://github.com/NoxCoreDev/Noxhostingtheme)
