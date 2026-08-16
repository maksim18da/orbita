from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from .forms import ContactForm, Registration_form
from .models import Registration, Homework, Lesson, ChatRoom, Message
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils import timezone
import re
from datetime import date, timedelta


def normalize_phone(raw):
    if not raw:
        return None
    digits = re.sub(r'\D', '', raw)
    if len(digits) == 11 and digits[0] in ('7', '8'):
        return '7' + digits[1:]
    if len(digits) == 10:
        return '7' + digits
    return None


def home_page(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Форма успешно отправлена!')
            return redirect('home_page')
        else:
            messages.error(request, 'Ошибка в заполнении формы')
    else:
        form = ContactForm()
    return render(request, 'orbita/orbita.html', {'form': form})


def registration_page(request):
    if request.method == 'POST':
        post_data = request.POST.copy()
        normalized_phone = normalize_phone(post_data.get('phone', ''))
        if not normalized_phone:
            return JsonResponse(
                {'success': False, 'error': 'Некорректный номер телефона', 'errors': {'phone': ['Некорректный номер телефона']}},
                status=400
            )
        post_data['phone'] = normalized_phone

        if Registration.objects.filter(phone=normalized_phone).exists():
            return JsonResponse(
                {'success': False, 'error': 'Пользователь с таким телефоном уже зарегистрирован',
                 'errors': {'phone': ['Такой номер уже используется']}},
                status=400
            )

        form = Registration_form(post_data)
        if form.is_valid():
            try:
                form.save()
            except Exception as e:
                return JsonResponse(
                    {'success': False, 'error': f'Ошибка сохранения: {e}'},
                    status=500
                )
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    else:
        form = Registration_form()
    return render(request, 'orbita/registration.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        phone_raw = request.POST.get('phone', '').strip()
        password = request.POST.get('password', '').strip()
        phone = normalize_phone(phone_raw)

        if not phone:
            return JsonResponse({'success': False, 'error': 'Некорректный номер телефона'}, status=400)

        try:
            user = Registration.objects.get(phone=phone)
        except Registration.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Неверный телефон или пароль'}, status=400)

        if user.status != 'approved':
            return JsonResponse({'success': False, 'error': 'Ваша заявка ещё не одобрена'}, status=403)

        if not check_password(password, user.password):
            return JsonResponse({'success': False, 'error': 'Неверный телефон или пароль'}, status=400)

        request.session['user_id'] = user.id
        request.session['user_name'] = user.name
        return JsonResponse({'success': True})

    return redirect('registration')

def reset_password_view(request):
    if request.method == 'POST':
        phone_raw = request.POST.get('phone', '').strip()
        new_password = request.POST.get('new_password', '').strip()
        phone = normalize_phone(phone_raw)

        if not phone or not new_password:
            return JsonResponse({'success': False, 'error': 'Введите телефон и новый пароль'}, status=400)

        try:
            user = Registration.objects.get(phone=phone)
        except Registration.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Пользователь с таким телефоном не найден'}, status=400)

        try:
            validate_password(new_password)
        except ValidationError as e:
            return JsonResponse({'success': False, 'error': ' '.join(e.messages)}, status=400)

        user.password = make_password(new_password)
        user.save()
        return JsonResponse({'success': True})

    return redirect('registration')

def logout_view(request):
    request.session.flush()
    return redirect('registration')

def about_page(request):
    return render(request, 'orbita/about.html')

def contact_view(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Форма успешно отправлена!')
            return redirect('home_page')
        else:
            messages.error(request, 'Ошибка в заполнении формы')
            return render(request, 'orbita/orbita.html', {'form': form})
    else:
        return redirect('home_page')


def get_or_create_chat_rooms(user):
    teacher_names = set(
        Lesson.objects.filter(student=user).values_list('teacher_name', flat=True)
    ) | set(
        Homework.objects.filter(student=user).values_list('teacher_name', flat=True)
    )
    teacher_names.discard('')
    for name in teacher_names:
        ChatRoom.objects.get_or_create(student=user, teacher_name=name)
    return ChatRoom.objects.filter(student=user).order_by('teacher_name')


def cabinet_view(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return redirect('registration')

    try:
        user = Registration.objects.select_related('tariff').get(id=user_id)
    except Registration.DoesNotExist:
        return redirect('registration')

    subjects = user.tariff.subjects_of_study.all() if user.tariff else []
    homeworks = Homework.objects.filter(student=user).select_related('subject').order_by('-created_at')

    subject_grades = {}
    for hw in homeworks:
        subject_name = hw.subject.title
        if subject_name not in subject_grades:
            subject_grades[subject_name] = {'total': 0, 'count': 0}
        subject_grades[subject_name]['total'] += hw.grade or 0
        subject_grades[subject_name]['count'] += 1

    progress = []
    for name, data in subject_grades.items():
        avg = int((data['total'] / data['count']) * 10) if data['count'] > 0 else 0
        progress.append({
            'subject': name,
            'percent': min(avg, 100)
        })

    months = [
        'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
        'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ]
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    day_keys = {
        'Пн': 'monday', 'Вт': 'tuesday', 'Ср': 'wednesday',
        'Чт': 'thursday', 'Пт': 'friday', 'Сб': 'saturday', 'Вс': 'sunday'
    }
    week_lessons = []
    for i in range(7):
        current_date = monday + timedelta(days=i)
        weekday = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]
        month_name = months[current_date.month - 1]
        day_key = day_keys[weekday]

        lessons_today = Lesson.objects.filter(
            student=user,
            start_time__date=current_date
        ).order_by('start_time')

        if lessons_today.exists():
            lessons_data = []
            for lesson in lessons_today:
                lessons_data.append({
                    'subject': lesson.subject.title,
                    'teacher': lesson.teacher_name,
                    'topic': lesson.topic,
                    'link': lesson.link,
                    'start_time': lesson.start_time,
                    'time': lesson.start_time.strftime('%H:%M'),
                    'subject_initial': lesson.subject.title[0],
                })

            week_lessons.append({
                'date': current_date,
                'has_lesson': True,
                'day': current_date.day,
                'weekday': weekday,
                'month': month_name,
                'day_key': day_key,
                'lessons': lessons_data,
            })
        else:
            week_lessons.append({
                'date': current_date,
                'has_lesson': False,
                'day': current_date.day,
                'weekday': weekday,
                'month': month_name,
                'day_key': day_key,
                'lessons': [],
            })

    all_week_lessons = []
    for day in week_lessons:
        if day['has_lesson']:
            for lesson in day['lessons']:
                all_week_lessons.append({
                    'day': day,
                    'lesson': lesson
                })
    upcoming_lessons = all_week_lessons[:3]

    chat_rooms = get_or_create_chat_rooms(user)
    chat_rooms_data = []
    for room in chat_rooms:
        last_msg = room.messages.last()
        chat_rooms_data.append({
            'id': room.id,
            'teacher_name': room.teacher_name,
            'initials': ''.join(w[0] for w in room.teacher_name.split()[:2]).upper(),
            'last_text': (last_msg.text if last_msg and last_msg.text else ('📎 файл' if last_msg else 'Нет сообщений')),
            'last_time': last_msg.created_at.strftime('%H:%M') if last_msg else '',
            'unread': room.messages.filter(sender_type='teacher', is_read=False).count(),
        })

    now = timezone.now()
    next_lesson = Lesson.objects.filter(
        student=user,
        start_time__gte=now
    ).order_by('start_time').first()

    next_lesson_data = None
    if next_lesson:
        lesson_date = next_lesson.start_time.date()
        is_today = lesson_date == today

        start_time_str = next_lesson.start_time.strftime('%H:%M')
        end_time = next_lesson.start_time + timedelta(hours=1)
        end_time_str = end_time.strftime('%H:%M')

        next_lesson_data = {
            'subject': next_lesson.subject.title,
            'topic': next_lesson.topic,
            'teacher': next_lesson.teacher_name,
            'teacher_initials': ''.join(w[0] for w in next_lesson.teacher_name.split()[:2]).upper(),
            'link': next_lesson.link,
            'start_time': next_lesson.start_time,
            'date_formatted': f'Сегодня, {start_time_str}–{end_time_str}' if is_today else next_lesson.start_time.strftime(
                '%d %B, %H:%M'),
            'is_today': is_today,
        }

    recent_homeworks = homeworks[:3]
    recent_homeworks_data = []
    status_map = {
        'verified': {'label': 'Проверено', 'color': '#1e8a3c'},
        'expired': {'label': 'Просрочено', 'color': '#E4463F'},
        'work': {'label': 'Ждёт выполнения', 'color': '#b8760a'},
    }
    for hw in recent_homeworks:
        status = hw.status
        recent_homeworks_data.append({
            'id': hw.id,
            'subject': hw.subject.title,
            'topic': hw.topic,
            'status': status,
            'status_label': status_map.get(status, {}).get('label', status),
            'status_color': status_map.get(status, {}).get('color', '#6E6E8F'),
            'grade': hw.grade,
        })

    homeworks_in_progress = homeworks.filter(
        due_date__gte=today,
        grade__isnull=True
    ).count()

    lessons_today_count = Lesson.objects.filter(
        student=user,
        start_time__date=today
    ).count()

    weekdays_ru = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
    weekday_ru = weekdays_ru[today.weekday()]
    date_formatted = f"{weekday_ru}, {today.day} {months[today.month - 1]}"

    verified_homeworks = homeworks.filter(grade__isnull=False)
    if verified_homeworks.exists():
        total_grade = sum(hw.grade for hw in verified_homeworks)
        avg_grade = round((total_grade / verified_homeworks.count()) * 10)
    else:
        avg_grade = 0

    lessons_count = Lesson.objects.filter(student=user).count()

    subjects_count = user.tariff.subjects_of_study.count() if user.tariff else 0

    expired_count = sum(1 for h in homeworks if h.status == 'expired')

    month_ago = today - timedelta(days=30)
    recent_hw = homeworks.filter(checked_at__gte=month_ago, grade__isnull=False)
    older_hw = homeworks.filter(checked_at__lt=month_ago, grade__isnull=False)

    if recent_hw.exists() and older_hw.exists():
        recent_avg = sum(hw.grade for hw in recent_hw) / recent_hw.count() * 10
        older_avg = sum(hw.grade for hw in older_hw) / older_hw.count() * 10
        progress_delta = round(recent_avg - older_avg)
    elif recent_hw.exists() and not older_hw.exists():
        recent_avg = sum(hw.grade for hw in recent_hw) / recent_hw.count() * 10
        progress_delta = round(recent_avg)
    else:
        progress_delta = 0

    context = {
        'user': user,
        'subjects': subjects,
        'homeworks': homeworks,
        'progress': progress,
        'week_lessons': week_lessons,
        'upcoming_lessons': upcoming_lessons,
        'chat_rooms': chat_rooms_data,
        'hw_all_count': homeworks.count(),
        'hw_expired_count': sum(1 for h in homeworks if h.status == 'expired'),
        'hw_work_count': sum(1 for h in homeworks if h.status == 'work'),
        'hw_verified_count': sum(1 for h in homeworks if h.status == 'verified'),
        'next_lesson': next_lesson_data,
        'recent_homeworks': recent_homeworks_data,
        'homeworks_in_progress': homeworks_in_progress,
        'lessons_today_count': lessons_today_count,
        'today_date_formatted': date_formatted,
        'avg_grade': avg_grade,
        'lessons_count': lessons_count,
        'subjects_count': subjects_count,
        'expired_count': expired_count,
        'progress_delta': progress_delta,
        'current_month': months[today.month - 1],
        'today': today,
    }

    response = render(request, 'orbita/profile.html', context)
    response['Cache-Control'] = 'no-store, no-cache, must-revalidate'
    response['Pragma'] = 'no-cache'
    return response

def upload_homework_view(request, homework_id):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Не авторизован'}, status=401)

    try:
        homework = Homework.objects.get(id=homework_id, student_id=user_id)
    except Homework.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Задание не найдено'}, status=404)

    if request.method != 'POST' or 'file' not in request.FILES:
        return JsonResponse({'success': False, 'error': 'Файл не передан'}, status=400)

    homework.student_file = request.FILES['file']
    homework.submitted_at = timezone.now()
    homework.save()

    return JsonResponse({'success': True})


def chat_messages_view(request, room_id):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Не авторизован'}, status=401)

    try:
        room = ChatRoom.objects.get(id=room_id, student_id=user_id)
    except ChatRoom.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Чат не найден'}, status=404)

    room.messages.filter(sender_type='teacher', is_read=False).update(is_read=True)

    messages_data = [{
        'id': m.id,
        'sender_type': m.sender_type,
        'text': m.text,
        'file_url': m.file.url if m.file else None,
        'file_name': m.file.name.split('/')[-1] if m.file else None,
        'time': m.created_at.strftime('%H:%M'),
    } for m in room.messages.all()]

    return JsonResponse({'success': True, 'messages': messages_data})


def chat_send_message_view(request, room_id):
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'success': False, 'error': 'Не авторизован'}, status=401)

    try:
        room = ChatRoom.objects.get(id=room_id, student_id=user_id)
    except ChatRoom.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Чат не найден'}, status=404)

    if request.method != 'POST':
        return JsonResponse({'success': False, 'error': 'Метод не разрешён'}, status=405)

    text = request.POST.get('text', '').strip()
    file = request.FILES.get('file')

    if not text and not file:
        return JsonResponse({'success': False, 'error': 'Пустое сообщение'}, status=400)

    Message.objects.create(room=room, sender_type='student', text=text, file=file)
    return JsonResponse({'success': True})