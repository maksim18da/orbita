document.addEventListener('DOMContentLoaded', function (){
    let popover_block = document.querySelector('.popover_block')
    let popover = document.querySelector('.popover')
    let timeoutId
    let registration = document.querySelector('.registration')
    let login = document.querySelector('.login')
    let login_page = document.querySelector('.login_page')
    let registration_page = document.querySelector('.registration_page')
    const form = document.querySelector('.registration_page form')

    window.addEventListener('load', ()=>{
        document.body.classList.add('loaded')
    })
    function showPopover(){
        clearTimeout(timeoutId)
        popover.classList.add('active')
    }
    function hidePopover(){
        timeoutId = setTimeout(()=>{
            popover.classList.remove('active')
        }, 100)
    }
    popover_block.addEventListener('mouseenter', showPopover)
    popover_block.addEventListener('mouseleave', hidePopover)

    document.querySelector('.copy-block').addEventListener('click', (e)=>{
        const text = e.currentTarget.getAttribute('data-copy')
        navigator.clipboard.writeText(text)
        .then(() => alert('Текст скопирован'))
    })
    function check_input_value(){
        const submit = document.querySelector('.button-submit')
        let error_text1 = document.getElementById('error-text1')
        let error_text2 = document.getElementById('error-text2')
        let error_mail = document.getElementById('error-mail')
        let error_phone = document.getElementById('error-phone')
        let error_password = document.getElementById('error-password')
        let text1 = document.getElementById('text1')
        let text2 = document.getElementById('text2')
        let email = document.getElementById('email')
        let phone = document.getElementById('phone')
        let password = document.getElementById('password')
        let checkbox = document.querySelector('.checkbox')
        const special_characters = [
            '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
            '-', '_', '=', '+', '[', ']', '{', '}', ';', ':',
            "'", '"', ',', '.', '/', '?', '>', '<'
        ];
        function isValidPhone(value){
            // Убираем всё, кроме цифр (знак '+' тоже отбрасываем, он нас не интересует —
            // важна только последовательность цифр). Номер должен начинаться с 7 или 8
            // и содержать после кода страны 10 цифр, либо быть просто 10-значным номером.
            const digits = value.replace(/\D/g, '')
            if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) return true
            if (digits.length === 10) return true
            return false
        }
        registration.classList.add('selected')
        function resetAndCheck() {
            isValide = true
            let hasDigits1 = false
            for (let symbol of text1.value.trim()){
                if (isNaN(symbol) == false){
                    hasDigits1 = true
                    break
                }
            }
            if (text1.value.trim() === '' || hasDigits1){
                isValide = false
            }

            let hasDigits2 = false
            for (let symbol of text2.value.trim()){
                if (isNaN(symbol) == false){
                    hasDigits2 = true
                    break
                }
            }
            if (text2.value.trim() === '' || hasDigits2){
                isValide = false
            }

            if (email.value.trim() === ''){
                isValide = false
            }
            if (email.value.trim() !== '' && (!email.value.includes('@') || !email.value.includes('.'))){
                isValide = false
            }

            if (phone.value.trim() === ''){
                isValide = false
            }
            if (phone.value.trim() !== '' && !isValidPhone(phone.value.trim())){
                isValide = false
            }

            function hasCapitalLetters (str){
                return str != str.toLowerCase()
            }
            function hasSpecialCharacters(str){
                for (let symbol of str){
                    if (special_characters.includes(symbol)){
                        return true
                    }
                }
                return false
            }
            function hasDigits(str){
                for (let symbol of str){
                    if (isFinite(symbol)){
                        return true
                    }
                }
                return false
            }

            if (password.value.trim() === ''){
                isValide = false
            }
            if (password.value.length < 6 && password.value.trim() !== ''){
                isValide = false
            }
            if (!hasDigits(password.value) && password.value.trim() !== ''){
                isValide = false
            }
            if (!hasCapitalLetters(password.value) && password.value.trim() !== ''){
                isValide = false
            }
            if (!hasSpecialCharacters(password.value) && password.value.trim() !== ''){
                isValide = false
            }
        }

        text1.addEventListener('input', ()=>{
            error_text1.classList.remove('active')
            error_text1.textContent = ''
            let hasDigits1  = false
            for (let symbol of text1.value.trim()){
                if (isNaN(symbol) == false){
                    hasDigits1 = true
                    break
                }
            }
            if (hasDigits1){
                error_text1.classList.add('active')
                error_text1.textContent = 'Правильно заполните данное поле'
            }
            resetAndCheck()
        })

        text2.addEventListener('input', ()=>{
            error_text2.classList.remove('active')
            error_text2.textContent = ''
            let hasDigits2  = false
            for (let symbol of text2.value.trim()){
                if (isNaN(symbol) == false){
                    hasDigits2 = true
                    break
                }
            }
            if(hasDigits2){
                error_text2.classList.add('active')
                error_text2.textContent = 'Правильно заполните данное поле'
            }
            resetAndCheck()
        })

        email.addEventListener('input', ()=>{
            error_mail.classList.remove('active')
            error_mail.textContent = ''
            if (!email.value.includes('@') || !email.value.includes('.')){
                error_mail.classList.add('active')
                error_mail.textContent = 'Правильно заполните данное поле'
            }
            if (email.value == ''){
                error_mail.classList.remove('active')
                error_mail.textContent = ''
            }
            resetAndCheck()
        })

        phone.addEventListener('input', ()=>{
            error_phone.classList.remove('active')
            error_phone.textContent = ''
            const trimmed = phone.value.trim()
            if (trimmed !== '' && !isValidPhone(trimmed)){
                error_phone.classList.add('active')
                error_phone.textContent = 'Правильно заполните данное поле'
            }
            if (trimmed === ''){
                error_phone.classList.remove('active')
                error_phone.textContent = ''
            }
            resetAndCheck()
        })

        password.addEventListener('input', ()=>{
            error_password.classList.remove('active')
            error_password.textContent = ''

            function hasCapitalLetters (str){
                return str != str.toLowerCase()
            }
            function hasSpecialCharacters(str){
                for (let symbol of str){
                    if (special_characters.includes(symbol)){
                        return true
                    }
                }
                return false
            }
            function hasDigits(str){
                for (let symbol of str){
                    if (isFinite(symbol)){
                        return true
                    }
                }
                return false
            }

            if (password.value.length < 6 && password.value !== ''){
                error_password.classList.add('active')
                error_password.textContent = 'Больше 6 символов'
            }
            else if (!hasDigits(password.value) && password.value !== ''){
                error_password.classList.add('active')
                error_password.textContent = 'Минимум одна цифра'
            }
            else if (!hasCapitalLetters(password.value) && password.value !== ''){
                error_password.classList.add('active')
                error_password.textContent = 'Минимум одна заглавная буква'
            }
            else if (!hasSpecialCharacters(password.value) && password.value !== ''){
                error_password.classList.add('active')
                error_password.textContent = 'Должны быть спецсимволы'
            }

            if(password.value == ''){
                error_password.classList.remove('active')
                error_password.textContent = ''
            }
            resetAndCheck()
        })

        form.addEventListener('submit', (e) => {
            e.preventDefault()
            resetAndCheck()

            if (!isValide || !checkbox.checked) {
                alert('Заполните все поля правильно!')
                return
            }

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value
            const formData = new FormData(form)

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrfToken
                }
            })
            .then(response => {
                return response.text().then(text => {
                    let data
                    try {
                        data = JSON.parse(text)
                    } catch (parseErr) {
                        console.error('Сервер вернул не-JSON ответ. Статус:', response.status, 'Тело ответа:', text)
                        throw new Error('server_returned_non_json')
                    }
                    return { status: response.status, data }
                })
            })
            .then(({ data }) => {
                if (data.success) {
                    document.querySelector('.selection').style.display = 'none'
                    document.querySelector('.data').style.display = 'none'
                    submit.style.display = 'none'
                    document.querySelector('.personal_data').style.display = 'none'
                    document.querySelector('.confirm').classList.add('active')
                } else {
                    console.error('Ошибка регистрации:', data)
                    alert(data.error || 'Ошибка отправки. Проверьте правильность заполнения полей.')
                }
            })
            .catch(err => {
                if (err.message && err.message.includes('message channel closed')) return
                if (err.message === 'server_returned_non_json') {
                    alert('Ошибка сервера при регистрации. Подробности в консоли браузера (F12).')
                } else {
                    console.error('Сетевая ошибка:', err)
                    alert('Ошибка соединения')
                }
            })
        })
    }
    check_input_value()

    registration.addEventListener('click', ()=>{
        registration.classList.add('selected')
        login_page.classList.remove('active')
        login.classList.remove('selected')
        registration_page.style.display = 'block'
        if (isResetMode) exitResetMode()
    })
    login.addEventListener('click', ()=>{
        registration_page.style.display = 'none'
        document.querySelector('.registration').classList.remove('selected')
        login_page.classList.add('active')
        login.classList.add('selected')
        if (isResetMode) exitResetMode()
    })
    let isResetMode = false
    let isResetPasswordValid = false
    const loginPhoneInput = document.getElementById('login_phone')
    const loginPasswordInput = document.getElementById('login_password')
    const confirmPasswordInput = document.getElementById('confirm_password')
    const errorResetPassword = document.getElementById('error-reset-password')
    const loginButton = document.querySelector('.button-login')
    const forgotPasswordLink = document.querySelector('.forgot_password')

    const reset_special_characters = [
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '-', '_', '=', '+', '[', ']', '{', '}', ';', ':',
        "'", '"', ',', '.', '/', '?', '>', '<'
    ]
    function resetHasCapitalLetters(str){
        return str != str.toLowerCase()
    }
    function resetHasSpecialCharacters(str){
        for (let symbol of str){
            if (reset_special_characters.includes(symbol)) return true
        }
        return false
    }
    function resetHasDigits(str){
        for (let symbol of str){
            if (isFinite(symbol) && symbol.trim() !== '') return true
        }
        return false
    }

    function validateResetPassword(){
        errorResetPassword.classList.remove('active')
        errorResetPassword.textContent = ''
        isResetPasswordValid = false

        const newPassword = loginPasswordInput.value
        const confirmPassword = confirmPasswordInput.value

        if (newPassword === '' && confirmPassword === ''){
            return
        }

        if (newPassword.length < 6 && newPassword !== ''){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Больше 6 символов'
            return
        }
        if (!resetHasDigits(newPassword) && newPassword !== ''){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Минимум одна цифра'
            return
        }
        if (!resetHasCapitalLetters(newPassword) && newPassword !== ''){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Минимум одна заглавная буква'
            return
        }
        if (!resetHasSpecialCharacters(newPassword) && newPassword !== ''){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Должны быть спецсимволы'
            return
        }
        if (confirmPassword !== '' && confirmPassword !== newPassword){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Пароли не совпадают'
            return
        }

        if (newPassword.length >= 6 && resetHasDigits(newPassword) && resetHasCapitalLetters(newPassword)
            && resetHasSpecialCharacters(newPassword) && confirmPassword === newPassword){
            isResetPasswordValid = true
        }
    }

    loginPasswordInput.addEventListener('input', () => {
        if (isResetMode) validateResetPassword()
    })
    confirmPasswordInput.addEventListener('input', () => {
        if (isResetMode) validateResetPassword()
    })

    function enterResetMode(){
        isResetMode = true
        isResetPasswordValid = false
        loginPasswordInput.value = ''
        loginPasswordInput.placeholder = 'Введите новый пароль'
        confirmPasswordInput.value = ''
        confirmPasswordInput.style.display = 'block'
        errorResetPassword.classList.remove('active')
        errorResetPassword.textContent = ''
        loginButton.textContent = 'Изменить'
        forgotPasswordLink.textContent = ''
    }

    function exitResetMode(){
        isResetMode = false
        isResetPasswordValid = false
        loginPasswordInput.value = ''
        loginPasswordInput.placeholder = 'Пароль'
        confirmPasswordInput.value = ''
        confirmPasswordInput.style.display = 'none'
        errorResetPassword.classList.remove('active')
        errorResetPassword.textContent = ''
        loginButton.textContent = 'Вход'
        forgotPasswordLink.textContent = 'Забыли пароль?'
    }

    forgotPasswordLink.addEventListener('click', () => {
        if (isResetMode){
            exitResetMode()
        } else {
            enterResetMode()
        }
    })

    function handleResetPassword(){
        const phone = loginPhoneInput.value.trim()

        validateResetPassword()

        if (!phone){
            errorResetPassword.classList.add('active')
            errorResetPassword.textContent = 'Введите телефон'
            return
        }
        if (!isResetPasswordValid){
            if (!errorResetPassword.textContent){
                errorResetPassword.classList.add('active')
                errorResetPassword.textContent = 'Заполните оба поля пароля'
            }
            return
        }

        const newPassword = loginPasswordInput.value
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value

        fetch('/reset-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `phone=${encodeURIComponent(phone)}&new_password=${encodeURIComponent(newPassword)}`
        })
        .then(response => {
            return response.text().then(text => {
                let data
                try {
                    data = JSON.parse(text)
                } catch (parseErr) {
                    console.error('Сервер вернул не-JSON ответ при смене пароля. Статус:', response.status, 'Тело:', text)
                    throw new Error('server_returned_non_json')
                }
                return data
            })
        })
        .then(data => {
            if (data.success) {
                alert('Пароль успешно изменён, теперь вы можете войти')
                exitResetMode()
                loginPhoneInput.value = ''
            } else {
                errorResetPassword.classList.add('active')
                errorResetPassword.textContent = data.error || 'Не удалось изменить пароль'
            }
        })
        .catch(err => {
            if (err.message && err.message.includes('message channel closed')) return
            if (err.message === 'server_returned_non_json') {
                errorResetPassword.classList.add('active')
                errorResetPassword.textContent = 'Ошибка сервера. Проверьте, добавлен ли маршрут /reset-password/ в urls.py'
            } else {
                console.error('Сетевая ошибка при смене пароля:', err)
                errorResetPassword.classList.add('active')
                errorResetPassword.textContent = 'Ошибка соединения'
            }
        })
    }

    function handleLogin(){
        const phone = loginPhoneInput.value.trim()
        const password = loginPasswordInput.value.trim()

        if (!phone || !password) {
            alert('Введите телефон и пароль')
            return
        }

        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value

        fetch('/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginPhoneInput.value = ''
                loginPasswordInput.value = ''
                window.location.href = '/cabinet/'
            } else {
                alert(data.error)
            }
        })
        .catch(err => {
            if (err.message && err.message.includes('message channel closed')) return
            alert('Ошибка соединения')
        })
    }

    loginButton.addEventListener('click', () => {
        if (isResetMode) {
            handleResetPassword()
        } else {
            handleLogin()
        }
    })
})