const $input = document.getElementById('ghost-input');
const $bubble = document.getElementById('ghost-bubble');
const $mouth = document.querySelector('.mouth');

$input.addEventListener('keydown', (event) => {
    const { keyCode, target } = event;
    if (keyCode === 13) {
        $bubble.innerText = target.value;
        target.value = '';
        return;
    }

    let i = 0;
    let timer;
    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        $mouth.classList.toggle('mouth--open');
        if (i === 6) {
            clearInterval(timer);
        }
    }, 300)
})