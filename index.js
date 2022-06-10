let currentSlide = 0;

const slideCount = 15;
const slides = [];

const portalAudio = new Audio('audio/portal.mp3');
const firstPortalAudio = new Audio('audio/slide0portal.mp3');

for (let i = 0; i < slideCount; i += 1) {
    const slide = {
        id: i,
        element: document.querySelector(`#slide${i}`),
    };

    if (i > 0) {
        slide.audio = new Audio(`audio/slide${i}.mp3`);
    }

    slides.push(slide);
}

slides.push({
    id: 100,
    element: document.querySelector('#slide100'),
});

let isBusy = false;
async function goToSlide(slideNum, open = true) {
    if (isBusy) return;
    isBusy = true;

    if (slideNum === currentSlide) return;

    const newSlide = slides[slideNum];
    const oldSlide = slides[currentSlide];

    currentSlide = slideNum;

    if (oldSlide.id === 0) {
        oldSlide.element.classList.add('isstarting');
        firstPortalAudio.currentTime = 0;
        firstPortalAudio.play();
        await wait(800);
        portalAudio.currentTime = 0;
        portalAudio.play();
    } else {
        portalAudio.currentTime = 0;
        portalAudio.play();
    }

    if (open) {
        oldSlide.element.classList.add('ispaused');

        await wait(10);
        oldSlide.element.classList.add('isopened');
    } else {
        oldSlide.element.classList.remove('isdoneopening');
        oldSlide.element.classList.remove('isfullsize');
    }

    await wait(2000);
    oldSlide.element.classList.remove('isactive');

    newSlide.element.classList.add('isactive');

    await wait(50);
    newSlide.element.classList.add('isfullsize');

    // clean up
    oldSlide.element.classList.remove('isstarting');
    oldSlide.element.classList.remove('ispaused');
    oldSlide.element.classList.remove('isopened');
    oldSlide.element.classList.remove('isfullsize');
    oldSlide.element.classList.remove('isdoneopening');

    await wait(2000);
    newSlide.element.classList.add('isdoneopening');
    isBusy = false;
    if (newSlide.audio) {
        newSlide.audio.currentTime = 0;
        newSlide.audio.play();
    }
}

for (const slide of slides) {
    if (slide.id === 0) {
        slide.element
            .querySelector('.entry-phone')
            .addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
    } else if (slide.id === 100) {
        slide.element
            .querySelector('.startover')
            .addEventListener('click', () => {
                goToSlide(0, false);
            });
    } else {
        slide.element
            .querySelector('.portalparent')
            .addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });
        slide.element
            .querySelector('.advance')
            .addEventListener('click', () => {
                goToSlide(currentSlide + 1);
            });

        if (slide.id > 1) {
            slide.element
                .querySelector('.goback')
                .addEventListener('click', () => {
                    goToSlide(currentSlide - 1, false);
                });
        } else {
            // go to last
            slide.element
                .querySelector('.goback')
                .addEventListener('click', () => {
                    goToSlide(slides.length - 1, false);
                });
        }
    }
}

// move slide 0 portal
function moveSlide0Portal() {
    const slide0Portals = document.querySelectorAll(
        '#slide0 .portal, #slide0 .preportal',
    );

    const slide0PortalBounding = document
        .querySelector('#slide0 .entry-phone-notif-icon')
        .getBoundingClientRect();
    for (const portal of slide0Portals) {
        portal.style.left = `${slide0PortalBounding.left}px`;
        portal.style.top = `${slide0PortalBounding.top}px`;
    }
}

setTimeout(moveSlide0Portal, 500);

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function sizeImages() {
    for (const slide of slides) {
        if (slide.id === 0 || slide.id === 100) continue;

        const imgContainer = slide.element.querySelector('.imagecontainer');
        const image = imgContainer.querySelector('img');

        const ratio = Math.max(
            window.innerWidth / image.naturalWidth,
            window.innerHeight / image.naturalHeight,
        );

        imgContainer.style.transform = `scale(${ratio})`;
    }
}
sizeImages();

window.addEventListener('resize', () => {
    sizeImages();
    moveSlide0Portal();
});
