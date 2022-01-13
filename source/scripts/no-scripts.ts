export function removeNoScriptsClass() {
    const noScriptsClass = 'no-scripts';
    const noScriptsElements = document.querySelectorAll(`.${noScriptsClass}`);

    noScriptsElements.forEach(element => element.classList.remove(noScriptsClass));
}
