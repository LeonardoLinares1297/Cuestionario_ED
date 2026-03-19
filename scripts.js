// ==========================================
// BASE DE DATOS DE PREGUNTAS
// ==========================================
const questions = [
    { 
        question: "¿Qué métrica define la facilidad de uso y la curva de aprendizaje de una interfaz?", 
        options: ["Accesibilidad", "Usabilidad", "Interactividad"], 
        answer: "Usabilidad" 
    },
    { 
        question: "¿Qué metodología prioriza el diseño para dispositivos pequeños antes que para escritorio?", 
        options: ["Desktop First", "Mobile First", "Fluid Design"], 
        answer: "Mobile First" 
    },
    { 
        question: "¿Qué patrón de escaneo visual suelen seguir los usuarios en páginas con mucho texto?", 
        options: ["Patrón en Z", "Patrón en F", "Lectura Lineal"], 
        answer: "Patrón en F" 
    },
    { 
        question: "Si un botón parece 'clicable' por su sombra y relieve, ¿qué concepto de diseño aplica?", 
        options: ["Significador", "Affordance", "Feedback"], 
        answer: "Affordance" 
    },
    { 
        question: "¿Cuál es el beneficio técnico de usar 'Espacio Negativo' (White Space)?", 
        options: ["Aumentar el tiempo de carga", "Reducir el ruido visual", "Mejorar el SEO"], 
        answer: "Reducir el ruido visual" 
    },
    { 
        question: "¿Qué componente de formulario es ideal para elegir una sola opción entre varias visibles?", 
        options: ["Checkbox", "Radio Button", "Dropdown Menu"], 
        answer: "Radio Button" 
    },
    { 
        question: "¿Cómo se llama el elemento que indica al usuario que una acción fue exitosa (ej. un check verde)?", 
        options: ["Feedback Visual", "Microinteracción", "Affordance"], 
        answer: "Feedback Visual" 
    },
    { 
        question: "En UX, ¿qué ley dice que el tiempo para tomar una decisión aumenta con el número de opciones?", 
        options: ["Ley de Fitts", "Ley de Hick", "Ley de Jakob"], 
        answer: "Ley de Hick" 
    },
    { 
        question: "¿Qué unidad de medida es preferible en CSS para lograr un diseño realmente responsivo?", 
        options: ["Pixeles (px)", "Unidades relativas (em/rem)", "Puntos (pt)"], 
        answer: "Unidades relativas (em/rem)" 
    },
    { 
        question: "¿Qué sistema de rejilla permite alinear elementos en dos dimensiones (filas y columnas) simultáneamente?", 
        options: ["Flexbox", "CSS Grid", "Float Layout"], 
        answer: "CSS Grid" 
    }
];

// VARIABLES DE ESTADO Y AUDIO
let current = 0;
let score = 0;

// Carga de sonidos 
const soundCorrect = new Audio('sonidos/nom.mp3'); 
const soundOof = new Audio('sonidos/uh.mp3');
const soundBye = new Audio('sonidos/bye.mp3');
const soundWelcome = new Audio('sonidos/hi.mp3');
const soundtrack = new Audio('sonidos/soundtrack.mp3');

// Configurar el soundtrack
soundtrack.loop = true;
soundtrack.volume = 0.5;
// FUNCIONES DE SESIÓN
function login() {
    const usernameInput = document.getElementById("username");
    const username = usernameInput.value.trim();
    if (username === "") {
        triggerErrorVisual();
        usernameInput.placeholder = "¡Escribe algo, genio!";
        return;
    }
    localStorage.setItem("user", username);
    soundWelcome.currentTime = 0;
    soundWelcome.play();
    showHome();
}

function showHome() {
    ensureMusic();
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.add("hidden");
    document.getElementById("homeScreen").classList.remove("hidden");
    const user = localStorage.getItem("user");
    document.getElementById("welcome").innerText = `CBTICITO DETECTADO: [${user}]`;
}

function logout() {
    localStorage.removeItem("user");
    soundBye.currentTime = 0;
    soundBye.play();
    setTimeout(() => {
        location.reload();
    }, 800); 
}

// FUNCIONES DEL JUEGO
function startLesson() {
    ensureMusic();
    current = 0;
    score = 0;
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("quizScreen").classList.remove("hidden");
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    document.getElementById("question").innerText = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.classList.add("option");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(btn);
    });
    updateProgress();
}

function checkAnswer(option) {
    if (option === questions[current].answer) {
        score++;
        soundCorrect.currentTime = 0;
        soundCorrect.play();
        avanzarPregunta();
    } else {
        soundOof.currentTime = 0;
        soundOof.play();
        triggerErrorVisual();
        // Le damos un pequeño delay para que sufra la animación antes de avanzar
        setTimeout(avanzarPregunta, 500); 
    }
}

function avanzarPregunta() {
    current++;
    if (current < questions.length) {
        showQuestion();
    } else {
        updateProgress(); // Llenar la barra al final
        setTimeout(showResult, 400);
    }
}

function triggerErrorVisual() {
    const container = document.getElementById("mainContainer");
    container.classList.remove("shake-animation");
    void container.offsetWidth; // Trigger reflow para reiniciar animación
    container.classList.add("shake-animation");
}

function updateProgress() {
    const percent = (current / questions.length) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

function showResult() {
    ensureMusic();
    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");
    
    const finalScore = (score / questions.length) * 100;
    let mensaje = "";
    
    if (finalScore === 100) {
        mensaje = "¡Felicidades! Xochitl estaría orgullosa de ti.";
    } else if (finalScore >= 60) {
        mensaje = "Pasable. Xochitl no se daría cuenta de que usaste IA.";
    } else {
        mensaje = "Mediocre. Xochitl estaría decepcionada de ti.";
    }
    
    document.getElementById("scoreText").innerHTML = `
        <p><strong>${mensaje}</strong></p>
        <h2 style="font-size: 48px; margin: 10px 0; color: #ffffff;">${score} / ${questions.length}</h2>
        <p>Aciertos totales</p>
    `;
}

function goHome() {
    showHome();
}

window.onload = () => {
    // Iniciar soundtrack
    soundtrack.currentTime = 0;
    soundtrack.play().catch(err => console.log('Autoplay bloqueado:', err));
    
    if (localStorage.getItem("user")) {
        showHome();
    }
}

// Asegurar que el soundtrack no se detiene al cambiar de pantalla
function ensureMusic() {
    if (soundtrack.paused) {
        soundtrack.play().catch(err => console.log('Autoplay bloqueado:', err));
    }
}