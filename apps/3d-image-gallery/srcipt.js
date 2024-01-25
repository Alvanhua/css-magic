const box = document.querySelector('.box');
window.onmousemove = (e) => {
    const x = e.clientX / 3;
    box.style.transform = `perspective(1000px) rotateY(${x}deg)`;
}