document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-quiz-btn')
    const closeBtn = document.getElementById('close-quiz-btn')
    const modal = document.getElementById('quiz-modal')

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex'
            document.body.style.overflow = 'hidden'
        })
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none'
            document.body.style.overflow = ''
        })
    }

    const overlay = modal?.querySelector('.quiz-modal__overlay')
    if (overlay) {
        overlay.addEventListener('click', () => {
            modal.style.display = 'none'
            document.body.style.overflow = ''
        })
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            modal.style.display = 'none'
            document.body.style.overflow = ''
        }
    })
})