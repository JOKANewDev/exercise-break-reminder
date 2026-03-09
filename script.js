let tempo = 600;

const exercicios = [
    "15 flexões",
    "20 agachamentos",
    "30 polichinelos",
    "30 segundos de prancha",
    "10 burpees",
    "40 segundos de corrida no lugar"
];

if(Notification.permission !== "granted"){
    Notification.requestPermission();
}

function startTimer(){
    setInterval(()=>{
        tempo--;

        let minutos = Math.floor(tempo/60);
        let segundos = tempo % 60;

        if(segundos < 10){
            segundos = "0"+ segundos
        }
        document.getElementById("timer").innerText = 
        minutos + ":" + segundos

        if (tempo <= 0 ){
            let random = exercicios[Math.floor(Math.random() *exercicios.length)]
            document.getElementById("exercise").innerText = 
            "Hora de Fazer: " + random;

            let som = new Audio("alert.mp3");
            som.play();

            new Notification("Hora de se mexer!!", {
                body: random
            });

            tempo = 600;
        }
    }, 1000)
}