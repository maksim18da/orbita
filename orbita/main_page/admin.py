from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Subject, Tariff, Registration, Contact, Homework, Lesson, ChatRoom, Message

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)


@admin.register(Tariff)
class TariffAdmin(admin.ModelAdmin):
    list_display = ('name', 'lessons_per_month', 'get_students')
    search_fields = ('name',)
    autocomplete_fields = ('subjects_of_study',)
    def get_students(self, obj):
        students = Registration.objects.filter(tariff=obj)
        if students.exists():
            return ", ".join([f"{s.name} {s.surname}" for s in students])
        return "—"
    get_students.short_description = 'Ученики'

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'phone_number', 'messenger')
    search_fields = ('name', 'surname', 'phone_number')


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'phone', 'status', 'created_at', 'tariff')
    list_filter = ('status', 'tariff')
    search_fields = ('name', 'surname', 'phone')
    readonly_fields = ('created_at',)
    autocomplete_fields = ('tariff',)
    fieldsets = (
        ('Заявка', {
            'fields': ('surname', 'name', 'email', 'phone', 'status', 'created_at')
        }),
        ('Профиль ученика (заполняется при одобрении)', {
            'fields': ('grade', 'tariff', 'subscription_until')
        }),
    )
@admin.register(Homework)
class HomeworkAdmin(admin.ModelAdmin):
    list_display = ('topic', 'subject', 'student', 'due_date', 'status_badge', 'grade', 'file_link')
    list_filter = ('subject', 'due_date')
    search_fields = ('topic', 'student__name', 'student__surname')
    autocomplete_fields = ('student', 'subject')
    readonly_fields = ('submitted_at', 'file_preview', 'teacher_file_preview')

    fieldsets = (
        ('Задание', {
            'fields': ('student', 'subject', 'teacher_name', 'topic', 'description', 'due_date', 'teacher_file')
        }),
        ('Сдача ученика', {
            'fields': ('submitted_at', 'file_preview')
        }),
        ('Проверка', {
            'fields': ('grade', 'teacher_comment', 'checked_at')
        }),
    )

    def status_badge(self, obj):
        colors = {'verified': '#1e8a3c', 'expired': '#d63b3b', 'work': '#b8760a'}
        labels = {'verified': 'Проверено', 'expired': 'Просрочено', 'work': 'В работе'}
        return format_html(
            '<span style="color:{};font-weight:700;">{}</span>',
            colors[obj.status], labels[obj.status]
        )
    status_badge.short_description = 'Статус'

    def file_link(self, obj):
        if obj.student_file:
            return format_html('<a href="{}" target="_blank">Открыть файл</a>', obj.student_file.url)
        return '—'
    file_link.short_description = 'Файл'

    def file_preview(self, obj):
        if obj.student_file:
            return format_html(
                '<a href="{}" target="_blank">📎 {}</a>',
                obj.student_file.url, obj.student_file.name.split('/')[-1]
            )
        return 'Файл ещё не загружен'
    file_preview.short_description = 'Файл ученика'

    def teacher_file_preview(self, obj):
        if obj.teacher_file:
            return format_html(
                '<a href="{}" target="_blank">📎 {}</a>',
                obj.teacher_file.url, obj.teacher_file.name.split('/')[-1]
            )
        return 'Файл ещё не загружен'

    teacher_file_preview.short_description = 'Файл учителя'

    def save_model(self, request, obj, form, change):
        if obj.grade is not None and obj.checked_at is None:
            obj.checked_at = timezone.now()
        super().save_model(request, obj, form, change)

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'topic', 'teacher_name', 'link', 'start_time')
    autocomplete_fields = ('student', 'subject')
    list_filter = ('subject',)
    search_fields = ('topic', 'teacher_name', 'student__name', 'student__surname')

class MessageInline(admin.TabularInline):
    model = Message
    extra = 1
    fields = ('sender_type', 'text', 'file', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('student', 'teacher_name', 'last_message_preview', 'unread_count')
    search_fields = ('student__name', 'student__surname', 'teacher_name')
    autocomplete_fields = ('student',)
    inlines = [MessageInline]

    def last_message_preview(self, obj):
        last = obj.messages.last()
        return (last.text[:40] + '…') if last and last.text else '—'
    last_message_preview.short_description = 'Последнее сообщение'

    def unread_count(self, obj):
        return obj.messages.filter(sender_type='student', is_read=False).count()
    unread_count.short_description = 'Непрочитано'