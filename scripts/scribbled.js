const targetElement = document.querySelector('#target');
const desiredText = 'Somos Nicolás, Gonzalo y Florian, tres amigos que siempre viajan juntos en el auto. Cada uno de nosotros tiene gustos musicales muy distintos, así que cuando estamos en el auto, la música también cambia. Gonzalo prefiere escuchar rock argentino a todo volumen, Nicolás disfruta del techno y a Florian le encanta el jazz. Aunque somos amigos cercanos y compartimos otros gustos (Programar-Hamburguesas), cuando analizamos numéricamente nuestra música vemos...que somos bastante diferentes, después de todo.';

// Generate a random scribble of the same length as desiredText
let scribbleText = '';
for(let i = 0; i < desiredText.length; i++) {
    let randomChar = desiredText[i] === ' ' ? ' ' : String.fromCharCode(Math.floor(Math.random() * (126 - 33)) + 33);
    scribbleText += randomChar;
}
targetElement.innerText = scribbleText;

let indexes = Array.from({length: desiredText.length}, (_, i) => i);
indexes = indexes.sort(() => Math.random() - 0.5);  // shuffle

let currentIdx = 0;
const interval = setInterval(() => {
    let changeIdx = indexes[currentIdx];
    scribbleText = scribbleText.substring(0, changeIdx) + desiredText[changeIdx] + scribbleText.substring(changeIdx + 1);
    targetElement.innerText = scribbleText;

    currentIdx++;
    if (currentIdx >= desiredText.length) {
        clearInterval(interval);
        setTimeout(highlightNames, 500);
    }
}, 5);

const highlightNames = () => {
    const names = ['Gonzalo', 'Nicolás', 'Florian'];
    const colors = ["#8b1874", "#fc4f00", "#6C9BCF"];
    let html = targetElement.innerText;

    for(let i = 0; i < names.length; i++) {
        const name = names[i];
        const color = colors[i];
        const reg = new RegExp(name, 'g');
        html = html.replace(reg, `<span class='highlight' style='background-color: ${color}'>${name}</span>`);
    }

    targetElement.innerHTML = html;
    setTimeout(() => {
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach((highlight) => highlight.classList.add('show'));
    }, 100);
}