document.addEventListener('DOMContentLoaded', ()=>{
    let savedSection = localStorage.getItem('section')
    if (savedSection){
        let current_page = document.querySelector(`.${savedSection}`)
        if (current_page){
            document.querySelectorAll('section').forEach(s => s.classList.remove('active'))
            current_page.classList.add('active')
        }
        document.querySelectorAll('.list ul li').forEach(item =>{
            let itemId = item.id.replace('-page', '')
            if (itemId == savedSection){
                item.style.color = '#000083'
                item.querySelector('.li-circle').classList.add('active')
            }
            else {
                item.style.color = '#6E6E8F'
                item.querySelector('.li-circle').classList.remove('active')
            }
        })
    }

    let li = document.querySelectorAll('li')
    li.forEach((elem)=>{
        elem.addEventListener('click', ()=>{
            let li_text = document.querySelectorAll('.list ul li')
            let circle = document.querySelectorAll('.li-circle')
            let section = document.querySelectorAll('section')
            localStorage.setItem('section', elem.id.replace('-page', ''))
            let saved_page = localStorage.getItem('section')
            if (saved_page){
                section.forEach(elem =>{
                    elem.classList.remove('active')
                    if (elem.className == `${saved_page}`){
                        elem.classList.add('active')
                    }
                })
            }
            circle.forEach((elem)=>{
                elem.classList.remove('active')
            })
            li_text.forEach((elem)=>{
                elem.style.color = '#6E6E8F'
            })
            elem.querySelector('.li-circle').classList.add('active')
            elem.style.color = '#000083'
        })
    })

    let status = document.querySelectorAll('.all, .expired, .work, .verified')
    let previos = document.querySelector('.all')
    let tasks = document.querySelectorAll('.task')
    status.forEach((elem)=>{
        elem.addEventListener('click', ()=>{
            tasks.forEach((elem)=>{
                elem.style.display = ''
            })
            if(elem.className == 'all'){
                tasks.forEach((elem)=>{
                    elem.style.display = ''
                })
            }
            if(elem.className == 'expired'){
                tasks.forEach((elem)=>{
                    if(elem.dataset.status != 'expired'){
                        elem.style.display = 'none'
                    }
                })
            }
            if(elem.className == 'work'){
                tasks.forEach((elem)=>{
                    if(elem.dataset.status != 'work'){
                        elem.style.display = 'none'
                    }
                })
            }
            if(elem.className == 'verified'){
                tasks.forEach((elem)=>{
                    if(elem.dataset.status != 'verified'){
                        elem.style.display = 'none'
                    }
                })
            }
            if (previos == elem){
                return
            }
            else{
                elem.style.background = '#000083'
                elem.style.color = '#FFFFFF'
                elem.querySelector('.count').style.background = '#FFFFFF20'
                elem.querySelector('.count').style.color = '#FFFFFF'
                previos.style.background = '#FBFBFD'
                previos.style.color = '#6E6E8F'
                previos.querySelector('.count').style.background = '#F1F4FF'
                previos.querySelector('.count').style.color = '#6E6E8F'
                previos = elem
            }
        })
    })

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    document.querySelectorAll('.upload-form').forEach(form => {
        const homeworkId = form.dataset.homeworkId;
        const fileInput = form.querySelector('input[type="file"]');

        fileInput.addEventListener('change', () => {
            if (!fileInput.files.length) return;

            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            fetch(`/cabinet/homework/${homeworkId}/upload/`, {
                method: 'POST',
                headers: { 'X-CSRFToken': getCookie('csrftoken') },
                body: formData,
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                } else {
                    alert(data.error || 'Не удалось загрузить файл');
                }
            });
        });
    });

    function current_week(){
        let month_name = [
            'января', 'февраля', 'марта', 'апреля',
            'мая', 'июня', 'июля', 'августа',
            'сентября', 'октября', 'ноября', 'декабря'
        ]
        let days_names = [
            'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday'
        ]
        let dayJS = new Date().getDay()
        let day = (dayJS == 0 ? 7 : dayJS)

        let monday = new Date()
        monday.setHours(0, 0, 0, 0)
        monday.setDate(monday.getDate() - (day - 1))

        let weekDates = []
        for (let i = 0; i < 7; i++) {
            let d = new Date(monday)
            d.setDate(monday.getDate() + i)
            weekDates.push(d)
        }

        let mondayDate = weekDates[0]
        let sundayDate = weekDates[6]

        return {
            weekDates,               // [Date, Date, ... x7]
            mondayDay: mondayDate.getDate(),
            sundayDay: sundayDate.getDate(),
            mondayMonth: month_name[mondayDate.getMonth()],
            sundayMonth: month_name[sundayDate.getMonth()],
            todayName: days_names[day - 1]
        }
    }
    let week = current_week()
    let weekLabel = (week.mondayMonth === week.sundayMonth)
        ? `${week.mondayDay} – ${week.sundayDay} ${week.sundayMonth}`
        : `${week.mondayDay} ${week.mondayMonth} – ${week.sundayDay} ${week.sundayMonth}`

    document.querySelector('.current-week').textContent = weekLabel
    document.querySelectorAll('.day-number').forEach((day, index) => {
        day.textContent = week.weekDates[index].getDate()
    })
    let current_day = document.querySelectorAll('.current-day')
    current_day.forEach(day =>{
        day.addEventListener('click', elem=>{
            let current = elem.currentTarget
            if (previos == current){
                return
            }
            if(previos){
                previos.classList.remove('active')
            }
            current.classList.add('active')
            previos = current
        })
    })
    let days = document.querySelectorAll('.current-day')
    let lessons = document.querySelectorAll('.lesson')
    days.forEach(day=>{
        let today = current_week().todayName
        if(today == day.id) {
            lessons.forEach(lesson=>{
                if (lesson.dataset.day == `${today}`) {lesson.classList.add('active')}
            })
            day.style.background = 'var(--dark-blue)'
            day.querySelectorAll('span').forEach(elem=>{
                elem.style.color = 'var(--white-color)'
            })
        }
        day.addEventListener('click', elem =>{
            lessons.forEach(elem => elem.classList.remove('active'))
            let dayId = elem.currentTarget.id
            lessons.forEach(lesson=>{
                if (lesson.dataset.day == dayId){
                    lesson.classList.add('active')
                    if (lesson.querySelector('.no-lesson')){
                        lesson.querySelector('.no-lesson').classList.add('active')
                        lesson.querySelector('.date-info').remove()
                    }
                }
            })
        })
    })

    function renderMessages(messages){
        const box = document.getElementById('chatMessages');
        if (!box) return;
        box.innerHTML = '';
        messages.forEach(m => {
            const div = document.createElement('div');
            // sender_type === 'student' -> "out" (ученик, слева), иначе "in" (учитель, справа)
            div.className = 'chat-msg ' + (m.sender_type === 'student' ? 'out' : 'in');

            const textEl = document.createElement('span');
            textEl.className = 'msg-text';
            if (m.file_url){
                const link = document.createElement('a');
                link.href = m.file_url;
                link.target = '_blank';
                link.textContent = m.file_name;
                textEl.appendChild(link);
            } else {
                textEl.textContent = m.text;
            }

            const timeEl = document.createElement('span');
            timeEl.className = 'msg-time';
            timeEl.textContent = m.time;

            div.appendChild(textEl);
            div.appendChild(timeEl);
            box.appendChild(div);
        });
        box.scrollTop = box.scrollHeight;
    }

    function updateChatHeader(roomId) {
        const contact = document.querySelector(`.chat-contact[data-room-id="${roomId}"]`);
        if (!contact) return;

        const name = contact.querySelector('.contact-name')?.textContent || 'Преподаватель';
        const initials = contact.querySelector('.initial')?.textContent || '—';

        const avatar = document.getElementById('chatAvatar');
        const nameEl = document.getElementById('chatTeacherName');

        if (avatar) avatar.textContent = initials;
        if (nameEl) nameEl.textContent = name;
    }

    function loadMessages(roomId){
        fetch(`/cabinet/chat/${roomId}/messages/`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    renderMessages(data.messages);
                    updateChatHeader(roomId);
                }
            });
    }

    function startPolling(roomId){
        if (pollingTimer) clearInterval(pollingTimer);
        pollingTimer = setInterval(() => loadMessages(roomId), 4000);
    }

    let activeRoomId = document.querySelector('.chat-contact')?.dataset.roomId || null;
    let pollingTimer = null;

    if (activeRoomId){
        updateChatHeader(activeRoomId);
        loadMessages(activeRoomId);
        startPolling(activeRoomId);
    }

    document.querySelectorAll('.chat-contact').forEach(contact => {
        contact.addEventListener('click', () => {
            document.querySelectorAll('.chat-contact').forEach(c => c.classList.remove('active'));
            contact.classList.add('active');
            activeRoomId = contact.dataset.roomId;

            updateChatHeader(activeRoomId);
            loadMessages(activeRoomId);
            startPolling(activeRoomId);
        });
    });

    document.getElementById('chatAttachBtn')?.addEventListener('click', () => {
        document.getElementById('chatFileInput').click();
    });

    document.getElementById('chatForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!activeRoomId) return;

        const textInput = document.getElementById('chatTextInput');
        const fileInput = document.getElementById('chatFileInput');
        const formData = new FormData();

        if (textInput.value.trim()) formData.append('text', textInput.value.trim());
        if (fileInput.files.length) formData.append('file', fileInput.files[0]);

        if (!textInput.value.trim() && !fileInput.files.length) return;

        fetch(`/cabinet/chat/${activeRoomId}/send/`, {
            method: 'POST',
            headers: { 'X-CSRFToken': getCookie('csrftoken') },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                textInput.value = '';
                fileInput.value = '';
                loadMessages(activeRoomId);
            } else {
                alert(data.error || 'Не удалось отправить сообщение');
            }
        });
    });
    let openHomeworksbtn = document.querySelectorAll('.open')
    openHomeworksbtn.forEach(btn=>{
        btn.addEventListener('click', elem=>{
            let current_open = elem.currentTarget
            current_open.closest('.home').classList.remove('active')
            document.querySelector(`.${current_open.id.replace('open-', '')}`).classList.add('active')
            li.forEach(li_elem=>{
                li_elem.style.color = 'var(--blue-gray-color)'
                li_elem.querySelectorAll('.li-circle').forEach(li=>{
                    li.classList.remove('active')
                })
                if (li_elem.id.replace('-page', '') == `${current_open.id.replace('open-', '')}`){
                    li_elem.style.color = 'var(--dark-blue)'
                    li_elem.querySelector('.li-circle').classList.add('active')
                }
            })
        })
    })
})