/* eslint-disable no-plusplus */

const host0 = 'https://anikolaevski-ahj10-http.herokuapp.com';
const port = '';
let CurrentUser;
const users = [];
const chat = [];

const loginForm = document.querySelector('#login-popup-template');
const PopupLoginButton = document.querySelector('#popup-loginbutton');
const DispUser = document.querySelector('#disp-user');

function newUser(user, isMe) {
  users.push({
    name: user,
    isMe
  });
}

function outMessage(text, typ) {
  const message = {
    created: new Date(),
    id: Math.random().toString(16).slice(2),
    user: CurrentUser,
    typ,
    text: (typ === 'message')? text: 'Вошел в чат'

  };
  ws.send(JSON.stringify(message));
  chat.push(message);
  console.log(chat);
  RefillListTbody();
}

function inMessage(data) {
  if (!data.includes('{')) { return; }
  const message = JSON.parse(data);
  if (!chat.find((o) => o.id === message.id)) {
    chat.push(message);
    RefillListTbody();
  }
}

function requestUser() {
  if (!CurrentUser) {
    if (!loginForm) { return; }
    loginForm.classList.remove('nodisp');    
  }
}

function submitLogin(evt) {
  evt.preventDefault();
  const PopupFldName = document.querySelector('#popup_fld_name');
  if (!PopupFldName) { return; }
  CurrentUser = PopupFldName.value;
  loginForm.classList.add('nodisp');
  if (DispUser && CurrentUser) { 
    DispUser.innerText = CurrentUser;
    outMessage('', 'newUser');
  }
}

function RefillListTbody() {
  const tbody = document.querySelector('#mz_tbody');
  tbody.innerHTML = '';

  for (const el of chat) {
    const message = document.createElement('div');
    tbody.appendChild(message);
    if (el.user === CurrentUser) {
      message.classList.add('showRight');
    } else {
      message.classList.add('showLeft');
    }
    message.innerHTML = `<span class="showUser">${el.user}</span>: ${el.text}`;
  }
  // console.log(data);
}

function requestList() {
  const url = `${host0}${port}/?method=allTickets`;

  async function run(link) {
    const response = await fetch(link);
    if (response.ok) {
      const data = await response.json();
      RefillListTbody(data);
    }
  }

  run(url);
}

const ws = new WebSocket('ws://localhost:7070/ws');
ws.binaryType = 'blob'; // arraybuffer

ws.addEventListener('open', () => {
  console.log('connected');
  // After this we can send messages
  ws.send('hello!');
});

ws.addEventListener('message', (evt) => {
  // handle evt.data
  console.log(evt.data);
});

ws.addEventListener('close', (evt) => {
  console.log('connection closed', evt);
  // After this we can't send messages
});

ws.addEventListener('error', () => {
  console.log('error');
});

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-console
  console.log('Module started!');
  requestUser();
});

PopupLoginButton.addEventListener('click', submitLogin);
