document.addEventListener('DOMContentLoaded', ()=>{
    const popUpHolder = document.querySelector(".popUp");
    const startButtons = document.querySelectorAll('.button_header_menu, .button_classes_in_Orbita');
    const videoBtn = document.querySelector('.button_description');
    const videoContainer = document.querySelector('.video-container');
    const video = document.querySelector('.promotional_video');
    const qstn_ttl = document.querySelectorAll('.question_title');
    const write_button = document.getElementById('write')
    const call_button = document.getElementById('call')
    const qrcode_overlay = document.querySelector('.qrcode-overlay')
    const taplinkQR = document.getElementById('taplinkQR')
    const phoneQR = document.getElementById('phoneQR')
    let popover_block = document.querySelector('.popover_block')
    let popover = document.querySelector('.popover')
    let timeoutId
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
        .then(() => alert('Номер скопирован'))
    })

    startButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            popUpHolder.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    popUpHolder.addEventListener("click", function(e) {
        if (e.target === popUpHolder) {
            popUpHolder.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    videoBtn.addEventListener("click", function(e) {
        e.preventDefault();
        videoContainer.classList.add("active");
        video.play();
        document.body.style.overflow = "hidden";
    });

    videoContainer.addEventListener("click", function(e) {
        if (e.target === videoContainer) {
            videoContainer.classList.remove("active");
            video.pause();
            video.currentTime = 0;
            document.body.style.overflow = "";
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            if (popUpHolder.classList.contains("active")) {
                popUpHolder.classList.remove("active");
                document.body.style.overflow = "";
            }
            if (videoContainer.classList.contains("active")) {
                videoContainer.classList.remove("active");
                video.pause();
                video.currentTime = 0;
                document.body.style.overflow = "";
            }
            if(taplinkQR.classList.contains('active') || phoneQR.classList.contains('active')){
                qrcode_overlay.classList.remove('active')
                taplinkQR.classList.remove('active')
                document.querySelector('.qrcode1').style.display = 'none'
                document.querySelector('.qrcode2').style.display = 'none'
                document.body.style.overflow = ''
            }
        }
    });
    video.preload = "auto";

    let toggleQuestion = function(){
        this.classList.toggle('active')
    }
    qstn_ttl.forEach(function(title){
        title.addEventListener("click", toggleQuestion)
    })
    window.addEventListener('message', function(event) {
        if (event.data === 'closeForm') {
            popUpHolder.classList.remove('active');
            document.body.style.overflow = "";
        }
    });
    write_button.addEventListener('click', ()=>{
        qrcode_overlay.classList.add('active')
        taplinkQR.classList.add('active')
        document.querySelector('.qrcode1').style.display = 'block'
        document.body.style.overflow = 'hidden'
    })
    qrcode_overlay.addEventListener('click', ()=>{
        if(taplinkQR.classList.contains('active') || phoneQR.classList.contains('active')){
            qrcode_overlay.classList.remove('active')
            taplinkQR.classList.remove('active')
            document.querySelector('.qrcode1').style.display = 'none'
            document.querySelector('.qrcode2').style.display = 'none'
            document.body.style.overflow = ''
        }
    })
    call_button.addEventListener('click', ()=>{
        qrcode_overlay.classList.add('active')
        phoneQR.classList.add('active')
        document.querySelector('.qrcode2').style.display = 'block'
        document.body.style.overflow = 'hidden'
    })
})