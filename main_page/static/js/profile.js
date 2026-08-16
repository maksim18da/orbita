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
        let current_Month_number = new Date().getMonth()
        let month_name = [
            'Января', 'Февраля', 'Марта', 'Апреля',
            'Мая', 'Июня', 'Июля', 'Августа',
            'Сентября', 'Октября', 'Ноября', 'Декабря'
        ]
        let today = [
            'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday'
        ]
        let dayJS = new Date().getDay()
        let day = (dayJS == 0 ? 7 : dayJS)
        let k, n
        k = day == 1 ? 0 : day-1
        n = day == 7 ? 0 : 7 - day
        let monday_date = new Date((Date.now() - k * 86400000)).getDate()
        let sunday_date = new Date((Date.now() + n * 86400000)).getDate()
        return [monday_date, sunday_date, month_name[current_Month_number], today[day-1]]
    }

    document.querySelector('.current-week').textContent = `${current_week()[0]} – ${current_week()[1]} ${current_week()[2]}`
    let arr = []
    for (let i = current_week()[0]; i <= current_week()[1]; i++){
        arr.push(i)
    }
    document.querySelectorAll('.day-number').forEach((day, index) =>{
        day.textContent = arr[index]
    })

    let previosDay = null
    let current_day = document.querySelectorAll('.current-day')
    current_day.forEach(day =>{
        day.addEventListener('click', elem=>{
            let current = elem.currentTarget
            if (previosDay  == current){
                return
            }
            if(previosDay ){
                previosDay .classList.remove('active')
            }
            current.classList.add('active')
            previosDay  = current
        })
    })

    let days = document.querySelectorAll('.current-day')
    let lessons = document.querySelectorAll('.lesson')
    let today = current_week()[3]

    days.forEach(day=>{
        if(today == day.id) {
            lessons.forEach(lesson=>{
                if (lesson.dataset.day == `${today}`) {lesson.classList.add('active')}
            })
            day.style.background = 'var(--dark-blue)'
            day.querySelectorAll('span').forEach(elem=>{
                elem.style.color = 'var(--white-color)'
            })
            lessons.forEach(lesson => {
                if (lesson.dataset.day == today) {
                    lesson.classList.add('active')
                    let noLesson = lesson.querySelector('.no-lesson')
                    if (noLesson) {
                        noLesson.classList.add('active')
                    }
                }
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
            div.className = 'chat-msg ' + (m.sender_type === 'student' ? 'out' : 'in');
            if (m.file_url){
                div.innerHTML = `<a href="${m.file_url}" target="_blank" style="color:inherit;">${m.file_name}</a><small>${m.time}</small>`;
            } else {
                div.innerHTML = `${m.text}<small>${m.time}</small>`;
            }
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