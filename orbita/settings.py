import os
from pathlib import Path

import dj_database_url
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def env(name, default=None):
    """Читает переменную окружения и убирает случайные пробелы/переводы строк."""
    value = os.getenv(name, default)
    return value.strip() if isinstance(value, str) else value


SECRET_KEY = env('SECRET_KEY', 'django-insecure-change-me-in-production')

DEBUG = env('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.vercel.app',
    'orbitaschool.pythonanywhere.com',
]

CSRF_TRUSTED_ORIGINS = [
    'https://*.vercel.app',
    'https://orbita-school.vercel.app',
]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# S3 включается, только если заданы ВСЕ три переменные.
# Если чего-то не хватает, сайт запустится на обычном хранилище, а не упадёт с 500.
USE_S3 = all(env(k) for k in ('S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'))
IS_VERCEL = bool(os.getenv('VERCEL'))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'main_page',
]

if USE_S3:
    INSTALLED_APPS.append('storages')

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'orbita.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'orbita.wsgi.application'

DATABASE_URL = env('DATABASE_URL')

if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=0),
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Asia/Novosibirsk'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static'] if (BASE_DIR / 'static').exists() else []
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'

if USE_S3:
    AWS_ACCESS_KEY_ID = env('S3_ACCESS_KEY')
    AWS_SECRET_ACCESS_KEY = env('S3_SECRET_KEY')
    AWS_STORAGE_BUCKET_NAME = env('S3_BUCKET')
    AWS_S3_ENDPOINT_URL = env('S3_ENDPOINT') or None
    AWS_S3_REGION_NAME = env('S3_REGION', 'eu-west-1')
    AWS_S3_SIGNATURE_VERSION = 's3v4'
    AWS_S3_ADDRESSING_STYLE = 'path'  # нужно для Supabase и большинства S3-совместимых сервисов
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None

    if env('S3_CUSTOM_DOMAIN'):
        AWS_S3_CUSTOM_DOMAIN = env('S3_CUSTOM_DOMAIN')

    DEFAULT_FILE_STORAGE_CONFIG = {
        'BACKEND': 'storages.backends.s3.S3Storage',
    }
else:
    MEDIA_ROOT = Path('/tmp/media') if IS_VERCEL else BASE_DIR / 'media'
    DEFAULT_FILE_STORAGE_CONFIG = {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    }

STORAGES = {
    'default': DEFAULT_FILE_STORAGE_CONFIG,
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'