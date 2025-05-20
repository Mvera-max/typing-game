const typingHtml=`
<div class="typing-header">
<div class="spacer"></div>
 <div class="h1"><h1></h1></div>
  <div id="timer">Time: 0s</div>
</div>
 

 <div id="quote">Select a level:</div>
 <button id="try-again" style="display:none;">Try again</button>
 <div class="time-text">Select a time:</div>

 <div class="buttons">
  <button class="easy">EASY</button>
  <button class="medium">MEDIUM</button>
  <button class="hard">HARD</button>
  <button class="impossible">IMPOSSIBLE</button>
 </div>

   <div class="timers" style="display:none;">
    <button class="half">30 sec</button>
    <button class="one">1 min</button>
    <button class="three">3 min</button>
    <button class="five">5 min</button>
    <button class="seven">7 min</button>
  </div>

 <textarea id="typing-area"placeholder="Start typing here!" disabled></textarea>



`

const gameSection= document.querySelector('.game-section');
gameSection.innerHTML=typingHtml;

const easyBtn= document.querySelector('.easy');
const mediumBtn= document.querySelector('.medium');
const hardBtn= document.querySelector('.hard');
const impossibleBtn= document.querySelector('.impossible');
const againBtn= document.getElementById('try-again');


const textEl = document.getElementById('quote');
const inputEl = document.getElementById('typing-area');
const timerEl = document.getElementById('timer');
const buttons = document.querySelector('.buttons');
const selectTime=document.querySelector('.time-text');

const halfMin = document.querySelector('.half');
const min1 = document.querySelector('.one');
const min3 = document.querySelector('.three');
const min5 = document.querySelector('.five');
const min7 = document.querySelector('.seven');

let gameMode;
function fetchText(level){
  gameMode=level;
  switch(level){
    case `impossible`:
    fetch(`https://poetrydb.org/random`)
    .then(res=> res.json())
    .then(data=>{
      const poem = data[0]
      const impossibleText=poem.lines.join(' ');
      displayText(impossibleText);
      textEl.classList.add('impossibler')
    })
    break;

    case 'medium':
    fetch("https://random-word-api.vercel.app/api?words=35")
    .then(res => res.json())
    .then(data =>{ 
      const mediumText=data.join(' ')
      displayText(mediumText)
    });
    break;
    case 'hard':
    fetch(`https://en.wikipedia.org/api/rest_v1/page/random/summary`)
    .then(res=>res.json())
    .then(data=>{
      const hardText=data.extract;
      displayText(hardText);
    });
    break;

    case `easy`:
    fetch("https://random-word-api.vercel.app/api?words=15")
    .then(res => res.json())
    .then(data =>{ 
      const easyText=data.join(' ')
      displayText(easyText)
  });
  }
}

function timerDisplay(){
  textEl.textContent=`Please select a time:`
  buttons.style.display='none'
  document.querySelector('.timers').style.display=`flex`
}

function displayText(words){
  timerDisplay();
  textEl.innerHTML=``;
  words.split('').forEach(char=>{
  const span=document.createElement('span');
  span.innerText=char;
  textEl.appendChild(span);
  textEl.style.display="none"
  document.querySelector('.time-text').style.display="block"
  document.querySelector('.h1').style.display="none"
 })}

function reset(){
  inputEl.value = '';
  inputEl.disabled = false;
  inputEl.focus();
}

function reseter(){
  inputEl.value = '';
  inputEl.disabled = true;
  textEl.style.display="none"
  buttons.style.display='flex'
  againBtn.style.display='none'
  //document.querySelector('.timers').style.display="flex"
  //document.querySelector('.time-text').style.display="block"
  selectTime.textContent=``
timerEl.textContent='Time:0';
}

let startTime;
let interval;

function timer(time){
  clearInterval(interval)
  const endTime = new Date().getTime() + time * 1000;
  startTime = new Date().getTime(); // Set start time when timer starts
  interval = setInterval(() => {
    const currentTime = new Date().getTime();
    const remaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));
    timerEl.textContent = `Time: ${remaining}s`;
    if (remaining <= 0){
      inputEl.disabled=true;
      clearInterval(interval);
      calculateWPM(); 
    }
  },1000);
};

let wpm;
function calculateWPM(){
  const inputWords = inputEl.value.trim().split(' ');
  const targetWords = textEl.textContent.trim().split(' ');

  let correctWords = 0;
  for (let i = 0; i < inputWords.length; i++){
    if (inputWords[i] === targetWords[i]) {
      correctWords++;
    } 
  }

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  wpm = Math.floor((correctWords / elapsedTime) * 60);
  textEl.textContent = `Time's up!\nYou typed at ${wpm} words per minute.`;
   againBtn.style.display='flex'
  return textEl;
}


inputEl.addEventListener('input',()=>{
  const textSpans = textEl.querySelectorAll('span');// selects all span elements i.e each letter
  const value = inputEl.value.split('');// splits the text in the input(user input) into letters
  let correct = true;// checks if only if what the user types is correct

  textSpans.forEach((span, index) => {// loops through each span element in the sentence
    const char = value[index];// targets each letter the user has typed.
    if (char == null) {// prevents the styles from working when the input is empty i.e when someone erases their text
      span.classList.remove('correct', 'incorrect', 'active');
    } else if (char === span.innerText) { // checks if the user's input matches the text, specefically the letter 
      span.classList.add('correct');//adds the green color
      span.classList.remove('incorrect', 'active'); // removes all the other styles
    } else {
      span.classList.add('incorrect');// if the letter is wrong, shows red
      span.classList.remove('correct', 'active');// removes other styles that would overlap with the intended effect
      correct = false;
    }

    // Add active underline to current character
    if (index === value.length) {// if the current letter the user is on matches that of the text's letters, a line is shown below 
      span.classList.add('active');
    } else {
      span.classList.remove('active');
    }
  })
 
  if (correct && value.length === textSpans.length){
    inputEl.disabled = true;
    clearInterval(interval);
    calculateWPM().textContent=`Congratulations! You have comleted the text🥳.\n You type at ${wpm} words per minute.`
  }
})

inputEl.addEventListener('paste', e => {
  e.preventDefault();
  alert("Nice try! But you gotta type it 😎");
});


easyBtn.addEventListener('click',()=>fetchText(`easy`));
mediumBtn.addEventListener('click',()=> fetchText(`medium`));
hardBtn.addEventListener('click',()=> fetchText('hard'));
impossibleBtn.addEventListener('click',()=> fetchText('impossible'));


halfMin.addEventListener('click',()=>stuff(30));
min1.addEventListener('click',()=>stuff(60))
min3.addEventListener('click',()=>stuff(180));
min5.addEventListener('click',()=>stuff(300));
min7.addEventListener('click',()=>stuff(420));
againBtn.addEventListener('click',()=>{
  reseter();
})

let trt;
function stuff(timeee){
  clearInterval(trt)
  let timeru=3
  trt = setInterval(()=>{
   document.querySelector('.timers').style.display="none"
  selectTime.textContent=timeru--
  if(timeru<=-1){
    clearInterval(trt)
    textEl.style.display="block"
    document.querySelector('.timers').style.display="none"
     timer(timeee);
     document.querySelector('.time-text').style.display="none"
     reset();
  }
 },1000)
}