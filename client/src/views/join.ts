import { $, View } from '../lib/turtle/main.js';
import { Router } from '../lib/turtle/router.js';

const html = /* html */`
    <h1>Worms II</h1>
    <input type='text' id='room-id' placeholder='Room ID'>
    <button id='go'>Go</button> <button id='random'>I'm lucky</button>
`;

function skipSpaces(str: string) {
    return str.replace(/\s/g, '');
}

export default class JoinView extends View<null> {
    private input: HTMLInputElement;

    constructor() {
        super('join', html);
        this.joinRoom.bind(this);
    }

    private async joinRoom(rnd?: boolean) {
        let url = document.URL.split('#')[0];
        if (rnd) {
            let resp = await fetch(url + 'method=getRoom');
            let id = (await resp.json()).id;
            Router.navigate(`room/${id}`);
        } else {
            let room = skipSpaces(this.input.value);
            let socket = Cookies.get('socket');
            console.log(`Saved socket: '${socket}'`);
            if (room !== '') {
                let resp = await fetch(url + `method=checkRoom$${room}/${socket}`);
                let exists = (await resp.json()).exists;
                if (exists) {
                    Router.navigate(`room/${room}`);
                }
            }
        }
    }

    load(path: string) {
        super.load(path);

        this.input = <HTMLInputElement> $('room-id');
        this.input.onkeypress = async event => {
            if (event.key === 'Enter') {
                await this.joinRoom();
            }
        };

        let goButton = <HTMLButtonElement> $('go');
        goButton.onclick = async () => await this.joinRoom();

        let rdButton = <HTMLButtonElement> $('random');
        rdButton.onclick = async () => await this.joinRoom(true);
    }
}
