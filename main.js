const popUpHolder = document.querySelector(".popUp");
const startButtons = document.querySelectorAll('.button_header_menu, .button_classes_in_Orbita');
const videoBtn = document.querySelector('.button_description');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.promotional_video');
const qstn_ttl = document.querySelectorAll('.question_title');
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
    }
});
video.preload = "auto";

let toggleQuestion = function(){
    this.classList.toggle('active')
}
qstn_ttl.forEach(function(title){
    title.addEventListener("click", toggleQuestion)
})
