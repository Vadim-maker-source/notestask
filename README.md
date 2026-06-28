# Notes — CTF Challenge

Минималистичное приложение для личных заметок с уязвимостью prototype pollution.

## 🎯 Для игроков

### Описание
Простое веб-приложение для хранения личных заметок. Поддерживает:
- Регистрацию и аутентификацию
- Создание и управление заметками
- Публичную ленту заголовков
- Настройки пользователя (тема, размер шрифта)

### Цель
В системе есть заметка с флагом, принадлежащая пользователю `admin@notes.ctf`. Ваша задача — получить доступ к её содержимому.

---

## 🚀 Деплой на VPS (для организаторов)

### Требования
- Ubuntu 20.04+ / Debian 11+
- Docker 20.10+
- Docker Compose v2+
- Git
- Открытые порты: 80, 443 (или другой по выбору)

### 1. Установка Docker (если ещё не установлен)

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Установить Docker Compose
sudo apt install docker-compose-plugin -y
```

### 2. Клонирование репозитория

```bash
cd /opt
sudo git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ> notes-ctf
cd notes-ctf
sudo chown -R $USER:$USER .
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
nano .env
```

Содержимое `.env`:

```env
# PostgreSQL
DB_PASSWORD=<сгенерируйте_сложный_пароль>

# NextAuth (сгенерируйте командой: openssl rand -base64 32)
NEXTAUTH_SECRET=<ваш_секрет>
NEXTAUTH_URL=http://your-domain.com

# CTF флаг
FLAG=flag{ваш_реальный_флаг}

# Пароль admin-аккаунта (НЕ давать игрокам)
ADMIN_PASSWORD=<сложный_пароль_для_админа>
```

**Генерация секретов:**
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# Пароли
openssl rand -base64 24
```

### 4. Запуск приложения

```bash
# Сборка и запуск
docker compose up -d --build

# Проверка логов
docker compose logs -f app

# Проверка статуса
docker compose ps
```

Приложение будет доступно на `http://localhost:3000`.

### 5. Настройка Nginx (reverse proxy)

Установите Nginx:
```bash
sudo apt install nginx -y
```

Создайте конфиг `/etc/nginx/sites-available/notes-ctf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте конфиг:
```bash
sudo ln -s /etc/nginx/sites-available/notes-ctf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Настройка iptables (файрвол)

```bash
# Сброс правил (осторожно!)
sudo iptables -F

# Разрешить loopback
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# Разрешить established соединения
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Разрешить SSH (замените 22 на ваш порт, если изменён)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Разрешить HTTP/HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Запретить всё остальное
sudo iptables -A INPUT -j DROP
sudo iptables -A FORWARD -j DROP

# Сохранить правила
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

### 7. SSL/HTTPS (опционально, рекомендуется)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### 8. Обслуживание

```bash
# Просмотр логов
docker compose logs -f

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Полная очистка (включая БД!)
docker compose down -v
```

---

## 🔧 Локальная разработка

### Требования
- Node.js 22+
- PostgreSQL 16+
- npm

### Установка

```bash
# Клонировать репозиторий
git clone <URL>
cd notes-ctf

# Установить зависимости
npm install

# Создать БД
createdb notes_ctf

# Настроить .env (скопировать из .env.example)
cp .env.example .env
# Отредактировать DATABASE_URL и другие переменные

# Запустить миграции
npx prisma migrate dev

# Заполнить тестовыми данными
npm run db:seed

# Запустить dev-сервер
npm run dev
```

Приложение доступно на `http://localhost:3000`.

---

## 📁 Структура проекта

```
notes-ctf/
├── prisma/
│   ├── schema.prisma      # Схема БД
│   └── seed.ts            # Seed-скрипт (создаёт admin + флаг)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API routes
│   │   ├── login/         # Страница входа
│   │   ├── register/      # Регистрация
│   │   ├── notes/         # Управление заметками
│   │   ├── feed/          # Публичная лента
│   │   ├── settings/      # Настройки пользователя
│   │   └── admin/         # Админ-панель (фейк + намёк)
│   ├── lib/               # Утилиты
│   │   ├── merge.ts       # 🔴 deepMerge (уязвимая функция)
│   │   ├── access.ts      # 🔴 canReadNote (гаджет)
│   │   ├── noteCache.ts   # In-memory кэш
│   │   └── ...
│   └── components/        # React-компоненты
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🛡️ Безопасность для организаторов

1. **Флаг в .env, не в коде** — исходники можно раздавать игрокам
2. **ADMIN_PASSWORD держать в секрете** — это пароль от admin@notes.ctf
3. **Регулярно проверять логи** — `docker compose logs`
4. **Ограничить rate-limit на Nginx** (опционально)

---

## 📝 Лицензия

Этот проект создан для образовательных CTF-соревнований.
