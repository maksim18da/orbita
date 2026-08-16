const closeBtn = document.querySelector(".close-btn");
const form = document.querySelector(".Contacts");

function closeForm() {
    form.reset();
    window.parent.postMessage('closeForm', '*');
}

closeBtn.addEventListener("click", function() {
    closeForm();
});

document.addEventListener("keydown", function(event) {
    if (event.key === 'Escape') {
        closeForm();
    }
});

form.addEventListener("click", function(event) {
    event.stopPropagation();
});

function validation(form){
    function validation_phone(phone){
        const validatephone = phone.replace(/[\s\-\(\)]/g, '')
        const phoneRegex = /^\+?[0-9]{10,15}$/
        return phoneRegex.test(validatephone)
    }

    function removeError(input){
        const parent = input.parentNode
        if (parent.classList.contains('error')){
            parent.classList.remove('error')
            input.classList.remove('error')
        }
    }

    function createError(input){
        const parent = input.parentNode;
        input.classList.add('error')
        parent.classList.add('error')
    }

    let res = true;

    form.querySelectorAll('.input-field').forEach(input => {
        removeError(input);
        if (input.value == ''){
            createError(input)
            res = false
        }
        const phonefield = input.placeholder && input.placeholder.toLowerCase().includes('телефон')
        if (phonefield && input.value.trim() != ''){
            if (validation_phone(input.value.trim()) === false){
                createError(input);
                res = false;
            }
        }
    });

    return res;
}

form.addEventListener('submit', function(e){
    if (validation(this) == true){
        alert('Форма успешна отправлена')
    } else {
        alert('Заполните правильно все поля');
    }
});