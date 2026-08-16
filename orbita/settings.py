import os
from pathlib import Path
from dotenv import load_dotenv  # Установите: pip install python-dotenv
import dj_database_url
# Загружаем переменные из .env файла
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Секретный ключ - берем из переменных окружения
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-#91x!$hdp#o@l+7!=u-h02c7&n-mu0pq2cy517v@!%z!@!!86+')

# DEBUG - выключаем в продакшене
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# ALLOWED_HOSTS - обязательно для Vercel
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.vercel.app',  # Важно для Vercel
]
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # ← ЭТУ СТРОКУ
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
# Добавьте ЭТОТ БЛОК после ALLOWED_HOSTS:
DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

# Если DATABASE_URL не задан (локальная разработка), используем SQLite
if not os.getenv('DATABASE_URL'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }