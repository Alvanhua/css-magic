const $ = (selector) => {
    return document.querySelector(selector);
}

const $hour = $('.hour');
const $min 	= $('.min');
const $sec 	= $('.sec');

const getTime = () => {
    const now = new Date();

    return {
        hour: String(now.getHours()).padStart(2, '0'),
        min: String(now.getMinutes()).padStart(2, '0'),
        sec: String(now.getSeconds()).padStart(2, '0'),
    };
}

const setDigits = (section, digit) => {
    const $tens = [
        ...section.children[0].children,
    ];
    const $ones = [
        ...section.children[1].children,
    ];
    $tens.forEach(($number) => $number.classList.remove('active'));
    $tens[digit[0]].classList.add('active');

    $ones.forEach(($number) => $number.classList.remove('active'));
    $ones[digit[1]].classList.add('active');
}

const update = () => {
    const time = getTime();

    setDigits($hour, time.hour);
    setDigits($min, time.min);
    setDigits($sec, time.sec);
}

update();
setInterval(update, 1000);