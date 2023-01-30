import './style.css'
import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

const form = document.querySelector("form") as HTMLFormElement;
const chat_Container = document.querySelector("#chat_container");

let loadInterval;

function loader(element:HTMLElement) {
  element.textContent = "";

  setInterval(() => {
    element.textContent += ".";

    if(element.textContent === "....") {
      element.textContent = "";
    }
  }, 300)
}

function textTyping(element:HTMLElement, text:string) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
    } else {
      clearInterval(interval)
    }
  }, 20)
}

function generateUniqueId() {
  let timestamp = Date.now();
  let randomNumber = Math.random();
  let hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi: boolean, value: string, uniqueId: any) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  const data = new FormData(form);

  chat_Container!.innerHTML+= chatStripe(false, data.get('prompt') as string, "");

  form.reset();

  const uniqueId = generateUniqueId();

  chat_Container!.innerHTML += chatStripe(true, " ", uniqueId);

  chat_Container!.scrollTop= chat_Container?.scrollHeight as number;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv as HTMLElement);
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e: any) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
});