// CONFIG
const TEMPO_PADRAO = 600 // 10 minutos em segundos

// ESTADO
let tempo = parseInt(localStorage.getItem("tempoRestante")) || TEMPO_PADRAO
let intervalo = null
let timerRodando = false

// AUDIO
let som = new Audio("alert.mp3")
som.loop = true

// EXERCICIOS
const exercicios = [
"15 flexões",
"20 agachamentos",
"30 polichinelos",
"30 segundos de prancha",
"10 burpees",
"40 segundos corrida no lugar"
]

// SERVICE WORKER
if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js")
}

// PERMISSÃO NOTIFICAÇÃO
if(Notification.permission !== "granted"){
Notification.requestPermission()
}

// ESTATISTICAS
let feitos = parseInt(localStorage.getItem("exercicios")) || 0

document.getElementById("stats").innerText =
"Exercícios feitos: " + feitos

// FORMATAR TEMPO
function formatarTempo(segundos){

let minutos = Math.floor(segundos / 60)
let seg = segundos % 60

if(seg < 10) seg = "0"+seg

return minutos + ":" + seg

}

// ATUALIZAR TELA
function atualizarTela(){

document.getElementById("timer").innerText =
formatarTempo(tempo)

document.title =
formatarTempo(tempo) + " ⏱ Active Break"

// CIRCULO
let progress = document.getElementById("progress")

if(progress){

let porcentagem = tempo / TEMPO_PADRAO
let offset = 565 - (565 * porcentagem)

progress.style.strokeDashoffset = offset

}

}

// TIMER
function startTimer(){

if(timerRodando) return

timerRodando = true

intervalo = setInterval(()=>{

tempo--

localStorage.setItem("tempoRestante", tempo)

atualizarTela()

// ACABOU O TEMPO
if(tempo <= 0){

clearInterval(intervalo)
timerRodando = false

let random =
exercicios[Math.floor(Math.random()*exercicios.length)]

document.getElementById("exercise").innerText =
"💪 Hora de Fazer: " + random

// SOM
som.play()

// VIBRAÇÃO
if(navigator.vibrate){
navigator.vibrate([200,100,200,100,200])
}

// NOTIFICAÇÃO
if(Notification.permission === "granted"){
new Notification("Hora de se mexer!",{
body: random
})
}

// TITLE ALERTA
document.title = "💪 Hora de Exercício!"

// ESTATISTICAS
feitos++

localStorage.setItem("exercicios", feitos)

document.getElementById("stats").innerText =
"Exercícios feitos: " + feitos

// RESET DO TEMPO (MAS NÃO INICIA)
tempo = TEMPO_PADRAO
localStorage.setItem("tempoRestante", tempo)

}

},1000)

}

// PAUSE
function pauseTimer(){

clearInterval(intervalo)

timerRodando = false

document.getElementById("exercise").innerText =
"⏸ Timer pausado"

}

// PARAR ALARME
function stopAlarm(){

som.pause()
som.currentTime = 0

}

// RESET TIMER
function resetTimer(){

pauseTimer()

tempo = TEMPO_PADRAO

localStorage.setItem("tempoRestante", tempo)

document.getElementById("exercise").innerText =
"Clique em iniciar"

atualizarTela()

}

// PAUSAR AUTOMATICO SE SAIR DA ABA
document.addEventListener("visibilitychange", () => {

if(document.hidden){

pauseTimer()

}

})

// DETECTAR INATIVIDADE

let tempoInativo = 0

setInterval(()=>{

tempoInativo++

if(tempoInativo >= 300){ // 5 minutos

mostrarSugestao()

tempoInativo = 0

}

},1000)

// RESET INATIVIDADE
document.addEventListener("mousemove", ()=> tempoInativo = 0)
document.addEventListener("keydown", ()=> tempoInativo = 0)

// SUGESTÃO AUTOMATICA
function mostrarSugestao(){

let random =
exercicios[Math.floor(Math.random()*exercicios.length)]

document.getElementById("exercise").innerText =
"⚡ Você ficou parado! Faça: " + random

if(Notification.permission === "granted"){

new Notification("Movimente-se!",{
body: random
})

}

}

// INICIAR TELA
atualizarTela()