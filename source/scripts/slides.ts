const activeClassName = 'active';
const squishClassName = 'squish';
const slideInClassName = 'slide-in';

const enum Direction {
    Backwards = -1,
    Forwards = 1
}

class Slides {
    private currentIndex: number = 0;
    private isIdle: boolean = true;

    private readonly label: HTMLElement | null;
    private readonly slides: NodeListOf<Element>;

    constructor(container: HTMLElement) {
        this.label = <HTMLElement>container.querySelector('nav .label');
        this.slides = container.querySelectorAll('.slide');

        this.markFirstSlideAsActive();
        this.updateLabel();
    }

    public changeSlide(direction: Direction) {
        if (!this.isIdle) {
            return;
        }

        const oldSlide = this.slides[this.currentIndex];

        this.isIdle = false;
        this.currentIndex = (this.slides.length + this.currentIndex + direction) % this.slides.length;

        const newSlide = this.slides[this.currentIndex];

        oldSlide.addEventListener('transitionend', () => this.handleFirstAnimationStep(oldSlide, newSlide, direction), { once: true });
        oldSlide.classList.add(direction === Direction.Forwards ? squishClassName : slideInClassName);
        oldSlide.classList.remove(activeClassName);
    };

    private handleFirstAnimationStep(oldSlide: Element, newSlide: Element, direction: Direction) {
        oldSlide.classList.remove(squishClassName, slideInClassName);

        this.updateLabel();

        newSlide.addEventListener('transitionend', () => this.handleSecondAnimationStep(newSlide), { once: true });
        newSlide.classList.add(activeClassName, direction === Direction.Forwards ? slideInClassName : squishClassName);
    };

    private handleSecondAnimationStep(newSlide: Element) {
        this.isIdle = true;

        newSlide.classList.remove(squishClassName, slideInClassName);
    };

    private markFirstSlideAsActive() {
        if (this.slides.length === 0) {
            throw new Error('No slide found.');
        }

        this.slides[0].classList.add(activeClassName);
    }

    private updateLabel() {
        if (this.label === null) {
            return;
        }

        this.label.innerText = `${this.currentIndex + 1} / ${this.slides.length}`;
    }
}

class ButtonNavigation {
    private readonly buttonPressCallback: ((direction: Direction) => void);

    constructor(container: HTMLElement, buttonPressCallback: (direction: Direction) => void) {
        this.buttonPressCallback = buttonPressCallback;

        const leftButtonElement = container.querySelector('nav button:first-child');
        const rightButtonElement = container.querySelector('nav button:last-child');

        this.attachButtonEvents(leftButtonElement, Direction.Backwards);
        this.attachButtonEvents(rightButtonElement, Direction.Forwards);
    }

    private attachButtonEvents(button: Element | null, direction: Direction) {
        if (button === null) {
            return;
        }

        button.addEventListener('keypress', () => this.buttonPressCallback(direction));
        button.addEventListener('mousedown', event => { event.preventDefault(); this.buttonPressCallback(direction); });
    }
}

class TouchNavigation {
    private isProperSwipe: boolean | null = null;
    private touchStartX: number = 0;
    private touchStartY: number = 0;

    private readonly swipeCallback: ((direction: Direction) => void);

    constructor(container: HTMLElement, swipeCallback: (direction: Direction) => void) {
        this.swipeCallback = swipeCallback;

        const slidesElement = container.querySelector('.slides');

        if (slidesElement === null) {
            return;
        }

        document.addEventListener('touchstart', event => this.handleGlobalTouchStart(<TouchEvent>event));

        slidesElement.addEventListener('touchstart', event => this.handleTouchStart(<TouchEvent>event));
        slidesElement.addEventListener('touchmove', event => this.handleTouchMove(<TouchEvent>event));
    }

    private handleGlobalTouchStart(event: TouchEvent) {
        if (event.touches.length > 1) {
            this.isProperSwipe = false;
        }
    }

    private handleTouchMove(event: TouchEvent) {
        if (event.touches.length > 1 || this.isProperSwipe !== null) {
            if (this.isProperSwipe === true) {
                event.preventDefault();
            }
            return;
        }
    
        const touchEndX = event.touches[0].clientX;
        const touchEndY = event.touches[0].clientY;
    
        if (Math.abs(touchEndX - this.touchStartX) <= Math.abs(touchEndY - this.touchStartY)) {
            this.isProperSwipe = false;

            return;
        }

        event.preventDefault();

        this.isProperSwipe = true;
        this.swipeCallback(touchEndX < this.touchStartX ? Direction.Forwards : Direction.Backwards);
    }

    private handleTouchStart(event: TouchEvent) {
        if (event.touches.length > 1) {
            this.isProperSwipe = false;

            return;
        }

        this.isProperSwipe = null;
        this.touchStartX = event.touches[0].clientX;
        this.touchStartY = event.touches[0].clientY;
    }
}

export function initializeSlides(container: HTMLElement | null) {
    if (container === null) {
        return;
    }

    const slides = new Slides(container);

    new ButtonNavigation(container, direction => slides.changeSlide(direction));
    new TouchNavigation(container, direction => slides.changeSlide(direction));
};
