document.addEventListener('DOMContentLoaded', ()=>{
    window.addEventListener('load', ()=>{
        document.body.classList.add('loaded')
        document.querySelector('.visual').classList.add('animate')
        document.querySelector('.headline').classList.add('animate')
        document.querySelector('.study-description').classList.add('animate')
        document.querySelector('.buttons').classList.add('animate')
        const improved_grades = document.getElementById('procent')
        const days = document.getElementById('days')
        const items = document.getElementById('items')
        const exam_procents = document.getElementById('exam_procents')

        const btn_back = document.querySelector('.back')
        const btn_forward = document.querySelector('.forward')
        let currentIndex = 0
        let cards_count = 7
        let slider_cards = document.querySelector('.cards')

        const obsever = new IntersectionObserver(e=>{
            e.forEach(entry=>{
                if (entry.isIntersecting){
                    animate_improved_gradest()
                    animate_days()
                    animate_items()
                    animate_exams()
                    obsever.unobserve(document.querySelector('.advantages_block'))
                }
            })
        })
        function animate_improved_gradest(){
            let start = 0
            let end = 80
            const timer = setInterval(()=>{
                start++
                if(start>=end){
                    start = end
                    clearInterval(timer)
                }
                improved_grades.textContent = `${start}%`
            }, 20)
        }
        function animate_days(){
            let start = 0
            let end = 24
            const timer = setInterval(()=>{
                start++
                if(start>=end){
                    start = end
                    clearInterval(timer)
                }
                days.textContent = `${start}/7`
            },65)
        }
        function animate_items(){
            let start = 0
            let end = 3
            const timer = setInterval(()=>{
                start++
                if(start>=end){
                    start = end
                    clearInterval(timer)
                }
                items.textContent = `${start}`
            },500)
        }
        function animate_exams(){
            let start = 0
            let end = 96
            const timer = setInterval(()=>{
                start++
                if(start>=end){
                    start = end
                    clearInterval(timer)
                }
                exam_procents.textContent = `${start}%`
            },15)
        }
        obsever.observe(document.querySelector('.advantages_block'))

        btn_forward.addEventListener('click', ()=>{
            currentIndex++
            if(currentIndex == cards_count){
                currentIndex = 0
            }
            slider_cards.style.transform = `translateX(-${currentIndex * 360}px)`
        })
        btn_back.addEventListener('click', ()=>{
            if(currentIndex == 0){
                slider_cards.classList.add('shake-back')
                let timer = setTimeout(()=>{
                    slider_cards.classList.remove('shake-back')
                },500)
            }
            if(currentIndex>0){
                currentIndex--
                slider_cards.style.transform = `translateX(-${currentIndex * 360}px)`
            }
        })
        const button_back = document.querySelector('.students-reviews .back')
        const button_forward = document.querySelector('.students-reviews .forward')
        let reviews_track = document.querySelector('.reviews-track')
        let start = 0
        let reviews = document.querySelectorAll('.reviews-box')
        let reviews_count = reviews.length - 2
        function review_forward(){
            if (start == reviews_count){
                start = 0
            }
            else{
                reviews_track.style.transform = `translateX(-${start * 400}px)`
            }
            if (start == 0){
                reviews_track.style.transform = `translateX(-${start * 400}px)`
            }
        }
        function review_back(){
            if (start == 0){
                reviews_track.classList.add('shake-back')
                let timer = setTimeout(()=>{
                    reviews_track.classList.remove('shake-back')
                },500)
            }
            if(start>0){
                start--
                reviews_track.style.transform = `translateX(-${start * 400}px)`
            }
        }
        let previos = null
        let current = null
        reviews.forEach(review=>{
            review.addEventListener('click', elem=>{
                current = elem.currentTarget
                if (current == previos){
                    current.classList.remove('active')
                    previos = null
                }
                else{
                    if (previos){previos.classList.remove('active')}
                    current.classList.add('active')
                    previos = current
                }
            })
        })
        button_forward.addEventListener('click', ()=>{
            start++
            review_forward()
            console.log(start)
        })
        button_back.addEventListener('click', ()=>{
            review_back()
        })
        document.addEventListener('click', elem=>{
            let target = elem.target
            if(!target.closest('.reviews-box')){
                reviews.forEach(review=>{
                    review.classList.remove('active')
                })
            }
        })
    })
})