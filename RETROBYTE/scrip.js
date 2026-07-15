const canvas = document.getElementById('Matrix');
const context = canvas.getContext('2d');
const white = "#777777"


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const nums = '01';

const alphabet = nums;

const fontSize = 14;
let columns = canvas.width / fontSize;

const rainDrops = [];

for (let x = 0; x < columns; x++) {
    rainDrops[x] = 1;
}
window.addEventListener('resize', function (event) {

    columns = canvas.width / fontSize;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }
});

const draw = () => {
    context.fillStyle = 'rgba(0, 0, 0, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = white;
    context.font = fontSize + 'px monospace';

    for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            rainDrops[i] = 0;
        }
        rainDrops[i]++;
    }
};

setInterval(draw, 30);