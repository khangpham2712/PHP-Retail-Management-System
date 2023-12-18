FROM php:7.4.2-apache-buster

RUN apt-get update

# 1. development packages
RUN apt-get install -y \
    git \
    zip \
    curl \
    sudo \
    unzip \
    libicu-dev \
    libonig-dev \
    libssl-dev \
    libbz2-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libmcrypt-dev \
    libreadline-dev \
    libfreetype6-dev \
    g++

# 2. apache configs + document root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 3. mod_rewrite for URL rewrite and mod_headers for .htaccess extra headers like Access-Control-Allow-Origin-
RUN a2enmod rewrite headers

# 4. start with base php config, then add extensions
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

RUN docker-php-ext-install \
    bz2 \
    gd \
    bcmath \
    mbstring \
    pdo_mysql \
    zip

# 5. composer
COPY --from=composer:2.4 /usr/bin/composer /usr/bin/composer

# 6. we need a user with the same UID/GID with host user
# so when we execute CLI commands, all the host file's ownership remains intact
# otherwise command from inside container will create root-owned files and directories
ARG uid
RUN useradd -G www-data,root -u $uid -d /home/devuser devuser
RUN mkdir -p /home/devuser/.composer && \
    chown -R devuser:devuser /home/devuser

# ENV COMPOSER_ALLOW_SUPERUSER=1

# COPY composer.json ./
# USER root
# RUN composer update

# RUN composer install --no-scripts

# USER devuser
# RUN php artisan key:generate
# RUN cp .env.example .env
# RUN php artisan key:generate
#CMD composer update && composer install && cp .env.example .env && php artisan key:generate
# CMD bash -c "composer install"
