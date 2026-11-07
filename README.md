# NOX HOSTING Panel

NOX HOSTING is a customized fork of the **Pterodactyl Panel**. It is the web control panel for managing game servers; it is not a standalone theme package, a hosting service, or a one-click installer. To actually run game servers, install and configure **Wings** on a Linux node as well.

This repository is based on Pterodactyl Panel **1.15.2**. The NOX HOSTING frontend assets are included in the repository, so Node.js is not required for a normal production installation. This project is independent and is not affiliated with Pterodactyl Software.

> **Important:** This repository currently has no published GitHub releases. The steps below install the source on the default `main` branch. Review the repository and pin the commit you install before using it for a production service. Do not download the upstream Pterodactyl `panel.tar.gz` if you want the NOX HOSTING customizations; that archive does not contain this fork's changes.

## What you need

- A fresh Linux VPS with root or `sudo` access. Ubuntu 24.04 is used in the example below; the upstream Pterodactyl documentation also lists other supported distributions and versions.
- A domain name pointed to the VPS, with ports 80 and 443 reachable for the web panel. Wings and game servers need their own ports opened as described in the relevant documentation.
- PHP 8.2 or 8.3 and the required extensions, MariaDB or MySQL, Redis, a web server, Git, and Composer 2.
- A separate Linux node (or a suitable additional setup on the same VPS) running Docker and Wings if you want to create and run game servers.

Pterodactyl is server software for administrators familiar with Linux. See the [official Panel installation guide](https://pterodactyl.io/panel/1.0/getting_started.html) and the [Wings installation guide](https://pterodactyl.io/wings/1.0/installing.html) before deploying it publicly.

## Install the Panel on Ubuntu 24.04

The commands below are a practical starting point for a new VPS. Replace `panel.example.com` and the database password with your own values. Run one command at a time and stop if a command reports an error.

### 1. Install the system dependencies

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y \
  ca-certificates curl git tar unzip composer nginx mariadb-server redis-server \
  php8.3 php8.3-cli php8.3-common php8.3-gd php8.3-mysql php8.3-mbstring \
  php8.3-bcmath php8.3-xml php8.3-curl php8.3-zip php8.3-fpm php8.3-opcache

sudo systemctl enable --now mariadb redis-server nginx php8.3-fpm
```

The PHP CLI package supplies core extensions such as PDO, OpenSSL, Tokenizer, and POSIX on Ubuntu. Check the PHP version with `php -v`. Install Composer 2 from the [official Composer instructions](https://getcomposer.org/download/) if the package manager did not provide Composer 2.

### 2. Create the database

Open the MariaDB shell:

```bash
sudo mariadb
```

Create a database and a dedicated account. Replace the example password with a unique, long password, then exit the MariaDB shell:

```sql
CREATE DATABASE panel;
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'REPLACE_WITH_A_LONG_RANDOM_PASSWORD';
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Download this fork and install PHP dependencies

```bash
sudo mkdir -p /var/www/pterodactyl
sudo chown "$USER":"$USER" /var/www/pterodactyl
git clone https://github.com/NoxCoreDev/Noxhostingtheme.git /var/www/pterodactyl
cd /var/www/pterodactyl

cp .env.example .env
composer install --no-dev --optimize-autoloader
chmod -R 755 storage/* bootstrap/cache/
```

If you are deploying a reviewed commit instead of the current branch, check out that commit before running Composer. Do not use `git pull` blindly on a live installation; back up first and follow the upstream upgrade instructions.

### 4. Configure the application and database

Generate the application key **only for a brand-new installation**, then complete the interactive setup:

```bash
php artisan key:generate --force
php artisan p:environment:setup
php artisan p:environment:database
php artisan p:environment:mail
```

Use `https://panel.example.com` as the application URL when prompted. Enter the database name `panel`, username `pterodactyl`, and the password created above. Configure SMTP if you need password resets or system email.

Back up the `APP_KEY` stored in `.env` together with your database backups. Never regenerate the key on an existing installation: encrypted data may become unreadable.

### 5. Create the database tables and administrator

```bash
php artisan migrate --seed --force
php artisan p:user:make
```

Follow the prompts to create the first administrator account.

### 6. Set file permissions and configure HTTPS

For a standard Ubuntu Nginx installation, give the web-server account access to the Panel files:

```bash
sudo chown -R www-data:www-data /var/www/pterodactyl
```

Configure Nginx to serve `/var/www/pterodactyl/public`, use PHP-FPM 8.3, and enable HTTPS with a valid certificate for your domain. Follow the [official Nginx web-server configuration guide](https://pterodactyl.io/panel/1.0/webserver_configuration.html); create the certificate before enabling an SSL configuration. Verify your DNS points to the VPS and that ports 80 and 443 are allowed by both the VPS firewall and provider firewall.

### 7. Enable scheduled tasks and the queue worker

Add the Panel scheduler to root's crontab by running `sudo crontab -e` and adding:

```cron
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

Create `/etc/systemd/system/pteroq.service` with the following contents:

```ini
[Unit]
Description=Pterodactyl Queue Worker
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

Enable the worker:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now pteroq.service
```

The Panel should now be reachable at your configured domain. Check Nginx, PHP-FPM, Redis, and the queue worker logs if something does not start.

## Run game servers with Wings

Installing the Panel alone does **not** start game servers. Install Docker and the matching Pterodactyl 1.x version of Wings on a Linux node, create that node in the Panel's administrator area, and apply its generated Wings configuration. Follow the [official Wings guide](https://pterodactyl.io/wings/1.0/installing.html) and the [Panel documentation](https://pterodactyl.io/panel/1.0/getting_started.html). Confirm that Docker is supported by your VPS provider; KVM virtualization is the safest choice. Open only the allocation and service ports you intend to use.

## Optional: rebuild the frontend

A normal server installation can use the compiled files already tracked under `public/assets`. Rebuild them only when developing or changing the frontend. The repository requires Node.js 22 or newer; from the repository directory, install the project's Yarn dependencies and run:

```bash
yarn install --frozen-lockfile
yarn build:production
```

## NOX HOSTING theme terms

The NOX HOSTING design, artwork, logo, and theme changes are covered by [`LICENSE-NOX-HOSTING.md`](./LICENSE-NOX-HOSTING.md). The license permits free use of the theme on your own Pterodactyl Panel and requires keeping the **“NOX HOSTING by NoxCoreDev”** footer credit. It does not permit selling the theme or logo, removing the credit, or presenting the NOX HOSTING brand as your own. Pterodactyl and Laravel remain subject to their respective licenses; see [`NOTICE.md`](./NOTICE.md) and [`LICENSE.md`](./LICENSE.md).

## Documentation and support

- [Pterodactyl Panel installation and configuration](https://pterodactyl.io/panel/1.0/getting_started.html)
- [Pterodactyl Nginx configuration](https://pterodactyl.io/panel/1.0/webserver_configuration.html)
- [Pterodactyl Wings installation](https://pterodactyl.io/wings/1.0/installing.html)
- [Pterodactyl community and support](https://discord.gg/pterodactyl)
- [This fork on GitHub](https://github.com/NoxCoreDev/Noxhostingtheme)
