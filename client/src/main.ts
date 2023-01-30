import './style.css'
import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

const form = document.querySelector("form") as HTMLFormElement;
const chat_Container = document.querySelector("#chat_container");

let loadInterval:any;

function loader(element:HTMLElement) {
  element.textContent = "";

  loadInterval = setInterval(() => {
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

  const messageDiv = document.getElementById(uniqueId) as HTMLElement;

  loader(messageDiv as HTMLElement);

  const response = await fetch("http://localhost:8080/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
       prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval);

  messageDiv!.innerHTML = " ";

  if(response.ok) {
    const data = await response.json();

    const parsedData = data.bot.trim();

    textTyping(messageDiv, parsedData);


  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e: any) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
});