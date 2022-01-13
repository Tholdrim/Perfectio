import { initializeSlides } from './slides'
import { removeNoScriptsClass } from './no-scripts'

const slidesContainer = document.getElementById('testimonials');

initializeSlides(slidesContainer);
removeNoScriptsClass();
