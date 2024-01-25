function load() {
    for (let i = 1; i <= 7; i++) {
        const r = rand(256);
        const g = rand(256);
        const b = rand(256);
        const id = `l${i}`;

        const el = document.getElementById(id);

        el.style.textShadow = 
        `
            1px 1px 10px rgb(${r}, ${g}, ${b}),
            1px 1px 20px rgb(${r}, ${g}, ${b}),
            1px 1px 30px rgb(${r}, ${g}, ${b}),
            1px 1px 40px rgb(${r}, ${g}, ${b}),
            1px 1px 60px rgb(${r}, ${g}, ${b})
        `;
    }
}

function rand(x) {
    return Math.floor(Math.random() * x);
}

window.onload = load();

setInterval(load, 5000);