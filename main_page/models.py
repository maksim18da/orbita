from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class Contact(models.Model):
    surname = models.CharField('Фамилия', max_length=20)
    name = models.CharField('Имя', max_length=20)
    phone_number = models.CharField('Телефон', max_length=20)
    messenger = models.CharField('Контактный мессенджер', max_length=20)

    def __str__(self):
        return f"Контакт от {self.name} {self.surname}"

    class Meta:
        verbose_name = 'Контакт'
        verbose_name_plural = 'Контакты'


class Subject(models.Model):
    title = models.CharField('Предмет', max_length=50, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Предмет'
        verbose_name_plural = 'Предметы'


class Tariff(models.Model):
    name = models.CharField('Название тарифа', max_length=50)
    subjects_of_study = models.ManyToManyField(Subject, verbose_name='Предметы')
    lessons_per_month = models.PositiveSmallIntegerField('Занятий в месяц')
    @property
    def subjects_count(self):
        return self.subjects_of_study.count()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Тариф'
        verbose_name_plural = 'Тарифы'


class Registration(models.Model):
    surname = models.CharField('Фамилия', max_length=20)
    name = models.CharField('Имя', max_length=20)
    email = models.EmailField('Почта', max_length=50)
    phone = models.CharField('Телефон', max_length=20, unique=True)
    password = models.CharField('Пароль', max_length=255)
    grade = models.CharField('Класс', max_length=20, blank=True)
    tariff = models.ForeignKey(
        Tariff, verbose_name='Тариф',
        on_delete=models.SET_NULL, null=True, blank=True
    )
    subscription_until = models.DateField('Действует до', null=True, blank=True)

    STATUS_CHOICES = [
        ('new', 'Новая заявка'),
        ('contacted', 'Связались с клиентом'),
        ('approved', 'Одобрена, аккаунт создан'),
        ('rejected', 'Отклонена'),
    ]
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField('Дата заявки', auto_now_add=True)

    @property
    def initials(self):
        return f"{self.name[:1]}{self.surname[:1]}".upper()

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} {self.surname}"

    class Meta:
        verbose_name = 'Регистрация'
        verbose_name_plural = 'Регистрации'

class Homework(models.Model):
    student = models.ForeignKey(
        Registration, verbose_name='Ученик',
        on_delete=models.CASCADE, related_name='homeworks'
    )
    subject = models.ForeignKey(Subject, verbose_name='Предмет', on_delete=models.CASCADE)
    teacher_name = models.CharField('Преподаватель', max_length=100, blank=True)
    topic = models.CharField('Тема задания', max_length=200)
    description = models.TextField('Описание задания', blank=True)
    due_date = models.DateField('Срок сдачи')
    teacher_file = models.FileField(
        'Файл учителя', upload_to='homework/student/%Y/%m/',
        null=True, blank=True
    )
    student_file = models.FileField(
        'Файл ученика', upload_to='homework/student/%Y/%m/',
        null=True, blank=True
    )
    submitted_at = models.DateTimeField('Дата сдачи', null=True, blank=True)

    grade = models.PositiveSmallIntegerField('Оценка', null=True, blank=True)
    teacher_comment = models.TextField('Комментарий преподавателя', blank=True)
    checked_at = models.DateTimeField('Дата проверки', null=True, blank=True)

    created_at = models.DateTimeField('Задано', auto_now_add=True)

    @property
    def status(self):
        if self.grade is not None:
            return 'verified'
        if self.due_date < timezone.now().date():
            return 'expired'
        return 'work'

    def __str__(self):
        return f"{self.subject} · {self.topic} — {self.student.name} {self.student.surname}"

    class Meta:
        verbose_name = 'Домашнее задание'
        verbose_name_plural = 'Домашние задания'

class Lesson(models.Model):
    student = models.ForeignKey(
        Registration, verbose_name='Ученик',
        on_delete=models.CASCADE, related_name='lessons'
    )
    subject = models.ForeignKey(Subject, verbose_name='Предмет', on_delete=models.CASCADE)
    teacher_name = models.CharField('Преподаватель', max_length=100)
    topic = models.CharField('Тема задания', max_length=200)
    link = models.CharField('Ссылка на занятие', max_length=500)
    start_time = models.DateTimeField('Время начало занятия')

    class Meta:
        verbose_name = 'Занятие'
        verbose_name_plural = 'Занятия'

class ChatRoom(models.Model):
    student = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='chat_rooms')
    teacher_name = models.CharField('Преподаватель', max_length=100)

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'
        unique_together = ('student', 'teacher_name')

    def __str__(self):
        return f"{self.student} ↔ {self.teacher_name}"


class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')

    SENDER_CHOICES = [('student', 'Ученик'), ('teacher', 'Преподаватель')]
    sender_type = models.CharField('Отправитель', max_length=10, choices=SENDER_CHOICES)

    text = models.TextField('Текст', blank=True)
    file = models.FileField('Файл', upload_to='chat_files/%Y/%m/', null=True, blank=True)

    created_at = models.DateTimeField('Отправлено', auto_now_add=True)
    is_read = models.BooleanField('Прочитано', default=False)

    class Meta:
        verbose_name = 'Сообщение'
        verbose_name_plural = 'Сообщения'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.get_sender_type_display()}: {self.text[:30]}"