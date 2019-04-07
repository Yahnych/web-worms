import { $, setView, Router } from '../lib/turtle.js';

export function IndexHandler() {
    let indexHtml = (<HTMLScriptElement> $('index')).innerHTML;
    setView(indexHtml);
    let button = <HTMLButtonElement> $('index-to-root');
    button.addEventListener('click', () => Router.navigate());
    console.log('KOK --- index');
}
