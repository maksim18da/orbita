const closeBtn = document.querySelector(".close-btn");
const form = document.querySelector(".Contacts");
const submitBtn = document.getElementById('button-submit')
closeBtn.addEventListener("click", function() {
    form.reset();
    window.parent.postMessage('closeForm', '*');
});

document.addEventListener("keydown", function(event) {
    if (event.key === 'Escape') {
        form.reset();
        window.parent.postMessage('closeForm', '*');
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
    function createError(intput){
        const parent = intput.parentNode;
        intput.classList.add('error')
        parent.classList.add('error')
        console.log(parent)
    }
    let res = true;
    form.querySelectorAll('.input-field').forEach(input => {
        removeError(input);
        if (input.value == ''){
            createError(input)
            res = false
            console.log('Ошибка')
        }
        const phonefield = input.placeholder.toLowerCase().includes('телефон')
        if (phonefield && input.value.trim() != ''){
            if (validation_phone(input.value.trim()) === false){
                createError(input);
                res = false;
                console.log('Неверный формат телефона');
            }
        }
    });
    return res;
}
form.addEventListener('submit', function(e){
    e.preventDefault()
    if (validation(this) == true){
        form.reset();
        alert('Форм успешна отправлена')
    }
    else{
        alert('Заполните правильно все поля')
    }
})