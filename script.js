const GIRL_NAME = "Princesa Hannia";
const YOUR_NAME = "Teacher Rigo";
const PASSWORD = "HyR";
const DEMO_PASSWORD = "pruebademo";
const TARGET_DATE = new Date("2026-01-01T00:00:00");
const AUDIO_SRC = "img/Creo En Ti.mp3";

let countdownTimer = null;
let revealed = false;
let fxPaused = false;
let fireworksInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  const lock = document.getElementById("lock");
  const passwordInput = document.getElementById("password");
  const enterBtn = document.getElementById("enter");
  const errorEl = document.getElementById("error");
  const lockDigits = {
    d: document.getElementById("ld"),
    h: document.getElementById("lh"),
    m: document.getElementById("lm"),
    s: document.getElementById("ls"),
  };

  initBackground();

  const unlocked = sessionStorage.getItem("unlocked") === "1";
  const unlockedDemo = sessionStorage.getItem("unlockedDemo") === "1";
  if (unlocked || unlockedDemo) {
    lock.style.display = "none";
    routeAfterUnlock(unlockedDemo ? "demo" : "main");
  }

  const attemptUnlock = () => {
    const val = passwordInput.value.trim();
    if (val === PASSWORD) {
      sessionStorage.setItem("unlocked", "1");
      lock.classList.remove("shake");
      errorEl.textContent = "";
      lock.style.display = "none";
      routeAfterUnlock("main");
    } else if (val === DEMO_PASSWORD) {
      sessionStorage.setItem("unlockedDemo", "1");
      lock.classList.remove("shake");
      errorEl.textContent = "";
      lock.style.display = "none";
      routeAfterUnlock("demo");
    } else {
      errorEl.textContent = "Esa no es… intenta otra vez 💛";
      lock.classList.remove("shake");
      // force reflow to restart animation
      void lock.offsetWidth;
      lock.classList.add("shake");
    }
  };

  enterBtn.addEventListener("click", attemptUnlock);
  passwordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptUnlock();
  });

  startLockCountdown(lockDigits);

  document.addEventListener("visibilitychange", () => {
    fxPaused = document.hidden;
  });
});

function routeAfterUnlock(mode = "main") {
  if (revealed) return;
  const now = new Date();
  if (mode === "demo") {
    triggerReveal(true);
  } else if (now >= TARGET_DATE) {
    triggerReveal();
  } else {
    renderCountdown();
  }
}

function renderCountdown() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <section class="card countdown fade-slide">
      <div class="count-label">Falta poquito… 💛</div>
      <div class="count-grid">
        <div class="count-box"><span class="num" id="d">00</span><span class="txt">días</span></div>
        <div class="count-box"><span class="num" id="h">00</span><span class="txt">horas</span></div>
        <div class="count-box"><span class="num" id="m">00</span><span class="txt">min</span></div>
        <div class="count-box"><span class="num" id="s">00</span><span class="txt">seg</span></div>
      </div>
    </section>
  `;
  const dEl = document.getElementById("d");
  const hEl = document.getElementById("h");
  const mEl = document.getElementById("m");
  const sEl = document.getElementById("s");

  const tick = () => {
    const now = new Date();
    const diff = TARGET_DATE - now;
    if (diff <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      triggerReveal();
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(minutes).padStart(2, "0");
    sEl.textContent = String(seconds).padStart(2, "0");
  };

  tick();
  countdownTimer = setInterval(tick, 250);
}

function startLockCountdown(lockDigits) {
  if (!lockDigits.d) return;
  const update = () => {
    const now = new Date();
    const diff = TARGET_DATE - now;
    const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
    const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
    const seconds = Math.max(0, Math.floor((diff / 1000) % 60));
    lockDigits.d.textContent = String(days).padStart(2, "0");
    lockDigits.h.textContent = String(hours).padStart(2, "0");
    lockDigits.m.textContent = String(minutes).padStart(2, "0");
    lockDigits.s.textContent = String(seconds).padStart(2, "0");
  };
  update();
  setInterval(update, 1000);
}

function triggerReveal(isPreview = false) {
  if (revealed) return;
  revealed = true;
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  burstConfetti(60, false);
  setTimeout(() => burstConfetti(80, true), 600);
  setTimeout(() => burstConfetti(60, true), 1200);
  setTimeout(() => {
    buildContent();
    startFireworksLoop();
  }, 1500);
}

function buildContent() {
  const app = document.getElementById("app");
  const photos = [
    { src: "img/Hannia1.jpeg", note: "Eres mi luz favorita, incluso a través de una pantalla." },
    { src: "img/Hannia2.jpeg", note: "Tus ojos son mi norte, aunque el mapa diga que estamos lejos." },
    { src: "img/Hannia3.jpeg", note: "Cada sonrisa tuya hace que el día valga más que ayer." },
    { src: "img/Hannia4.jpeg", note: "Me inspiras a ser mejor, porque quiero merecer todo lo bonito que eres." },
    { src: "img/Hannia5.jpeg", note: "Tu risa es el audio que más repito en mi cabeza." },
    { src: "img/Hannia6.jpeg", note: "No hay filtro que supere cómo iluminas mis pensamientos." },
    { src: "img/Hannia7.jpeg", note: "Eres mi certeza: incluso con kilómetros, sé dónde está mi hogar." },
    { src: "img/Hannia8.jpeg", note: "La distancia es pequeña comparada con lo grande que te amo." },
    { src: "img/Hannia9.jpeg", note: "Contigo aprendí que la paciencia también puede ser romántica." },
    { src: "img/Hannia10.jpeg", note: "Tus mensajes son mi refugio diario, tus fotos mi vitamina." },
    { src: "img/Hannia11.jpeg", note: "Cada detalle tuyo me recuerda por qué elegí quedarme." },
    { src: "img/Hannia12.jpeg", note: "Eres mi plan favorito, aun cuando el plan sea esperar." },
    { src: "img/Hannia13.jpeg", note: "Si pudiera elegir un lugar, sería donde estés, siempre." },
    { src: "img/Hannia14.jpeg", note: "Me enamora cómo eres auténtica en cada gesto y mirada." },
    { src: "img/Hannia15.jpeg", note: "No hay kilómetros que apaguen lo mucho que te amo." },
    { src: "img/Hannia16.jpeg", note: "Me encanta cómo haces sencillo cualquier día complicado." },
    { src: "img/Hannia17.jpeg", note: "Eres ternura y fuerza al mismo tiempo, y me inspiras diario." },
    { src: "img/Hannia18.jpeg", note: "Tu voz es el sonido que más calma me da." },
    { src: "img/Hannia19.jpeg", note: "Eres la chispa que enciende mis ganas de cumplirlo todo." },
    { src: "img/Hannia20.jpeg", note: "Amo cómo te ríes con todo el cuerpo, es contagioso." },
    { src: "img/Hannia21.jpeg", note: "Tu mirada me hace sentir en casa aunque esté lejos." },
    { src: "img/Hannia22.jpeg", note: "Eres la historia más bonita que cuento cuando hablo de amor." },
    { src: "img/Hannia23.jpeg", note: "Eres suave y valiente; admiro cada parte de ti." },
    { src: "img/Hannia24.jpeg", note: "Me haces creer que el tiempo y la distancia son pequeños." },
    { src: "img/Hannia25.jpeg", note: "Tu alegría me recuerda que todo vale la pena." },
    { src: "img/Hannia26.jpeg", note: "Amo cómo sueñas en grande y me invitas a soñar contigo." },
    { src: "img/Hannia27.jpeg", note: "Tus abrazos imaginados ya son mis favoritos." },
    { src: "img/Hannia28.jpeg", note: "Eres mi persona favorita para todas las versiones de mí." },
    { src: "img/Hannia29.jpeg", note: "Tu curiosidad es mi puerta a nuevos mundos." },
    { src: "img/Hannia30.jpeg", note: "Eres calma y aventura a la vez; contigo quiero ambas." },
    { src: "img/Hannia31.jpeg", note: "Amo cómo iluminas incluso las fotos con poca luz." },
    { src: "img/Hannia32.jpeg", note: "Eres poesía en lo cotidiano, canción en los silencios." },
    { src: "img/Hannia33.jpeg", note: "Me inspiras a cuidar más, a escuchar más, a amar mejor." },
    { src: "img/Hannia34.jpeg", note: "Tu forma de querer es mi lugar seguro." },
    { src: "img/Hannia35.jpeg", note: "Eres mi guiño favorito del universo." },
    { src: "img/Hannia36.jpeg", note: "Amo cómo me haces reír con cosas mínimas." },
    { src: "img/Hannia37.jpeg", note: "Eres la constancia que necesito y la sorpresa que disfruto." },
    { src: "img/Hannia38.jpeg", note: "Tus sueños también son los míos; vamos tras ellos." },
    { src: "img/Hannia39.jpeg", note: "Eres más bonita que cualquier recuerdo que guardo." },
    { src: "img/Hannia40.jpeg", note: "Tu energía me levanta incluso en mis días más lentos." },
    { src: "img/Hannia41.jpeg", note: "Eres mi pausa favorita en un mundo acelerado." },
    { src: "img/Hannia42.jpeg", note: "Tu dulzura y tu humor son el dúo perfecto." },
    { src: "img/Hannia43.jpeg", note: "Eres la chispa que le pone brillo a cada plan." },
    { src: "img/Hannia44.jpeg", note: "Amo que seas auténtica: contigo todo se siente real." },
    { src: "img/Hannia45.jpeg", note: "Eres mi canción repetida, mi playlist favorita." },
    { src: "img/Hannia46.jpeg", note: "Eres la calma en medio del ruido y la risa en mis silencios." },
    { src: "img/Hannia47.jpeg", note: "Tu manera de ver la vida me enseña a apreciar lo simple." },
    { src: "img/Hannia48.jpeg", note: "Eres mi presente más bonito y mi futuro más deseado." },
    { src: "img/Hannia49.jpeg", note: "No hay distancia que cambie lo mucho que te amo." }
  ];

  const message = `
    <section class="card fade-slide hero">
      <div class="tag">Feliz Año Nuevo</div>
      <h1>Feliz Año Nuevo 2026, ${GIRL_NAME} ✨</h1>
      <div class="audio-player">
        <div class="audio-top">
          <button id="audio-toggle" class="ghost-btn small" aria-label="Reproducir o pausar">▶</button>
          <div>
            <div class="audio-title">Te quiero mucho Cielo :)</div>
          </div>
        </div>
        <div class="audio-progress">
          <div class="audio-bar" id="audio-bar">
            <div class="audio-bar-fill" id="audio-fill"></div>
          </div>
          <div class="audio-time">
            <span id="audio-current">0:00</span>
            <span id="audio-duration">0:00</span>
          </div>
        </div>
      </div>
      <p>Gracias por llegar a mi vida. Este año quiero que, aunque haya kilómetros, se sienta que estamos cerquita, celebrando cada cosa como si estuviéramos en la misma sala.</p>
      <p>Me emociona que seamos pareja; pensar en nuestras llamadas nocturnas, las cartas que nos debemos y las visitas que planeamos me hace sonreír como si ya estuviera a tu lado.</p>
    </section>
    <section class="grid two-col fade-slide">
      <div class="card">
        <div class="section-title">Solo quería decirte que...</div>
        <p>Me encanta cómo miras el mundo y cómo me miras a mí, incluso a través de una pantalla. Sé que este año será nuestro escenario para crecer, aprender y cuidarnos con paciencia mientras la distancia se convierte en un puente lleno de detalles, llamadas nocturnas y promesas que vamos cumpliendo a nuestro ritmo.</p>
        <p>Me aferro a cada mensaje, cada nota de voz y cada plan que trazamos; son formas de abrazarnos cuando los kilómetros se hacen largos. Me inspiras a ser paciente, presente y atento; a recordarte a diario que eres la parte más linda de mi día, sin importar el huso horario ni el lugar.</p>
        <p class="quote">“Aquí está mi voz y mi tiempo; caminemos juntos aunque el mapa tenga kilómetros.”</p>
      </div>
      <div class="card">
        <div class="section-title">Lo que sueño para nosotros en 2026</div>
        <ul class="list">
          <li>Listas de sueños tachados a distancia, celebrando cada avance en nuestras llamadas.</li>
          <li>Visitas planeadas con cuidado, contando los días hasta el próximo abrazo.</li>
          <li>Domingos lentos: café, playlists y tu voz siendo mi canción favorita.</li>
          <li>Fotos nuevas que cuenten nuestra historia con sonrisas y complicidad.</li>
          <li>Planear el futuro sin miedo porque sé que lo caminamos juntos.</li>
        </ul>
      </div>
    </section>
    <section class="card fade-slide" id="collage">
      <div class="section-title">Tus fotos favoritas</div>
      <p>Cada foto es un mensaje para ti, con un cumplido que te recuerda cuánto te amo.</p>
      <div class="carousel">
        <div class="carousel-frame">
          <img id="carousel-img" alt="Recuerdo con ${GIRL_NAME}" tabindex="0">
          <div class="carousel-caption" id="carousel-caption"></div>
          <button class="carousel-nav prev" aria-label="Anterior">‹</button>
          <button class="carousel-nav next" aria-label="Siguiente">›</button>
        </div>
        <div class="carousel-progress" id="carousel-progress"></div>
      </div>
    </section>
    <div class="footer fade-slide">Con amor, ${YOUR_NAME}, para Mi Novia hermosa — 31/12/2025 → 2026</div>
  `;

  app.innerHTML = message;
  renderCarousel(photos);
  setupAudioPlayer();
}

function renderCarousel(photos) {
  const imgEl = document.getElementById("carousel-img");
  const captionEl = document.getElementById("carousel-caption");
  const progressEl = document.getElementById("carousel-progress");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const prevBtn = document.querySelector(".lightbox-nav.prev");
  const nextBtn = document.querySelector(".lightbox-nav.next");
  const navPrev = document.querySelector(".carousel-nav.prev");
  const navNext = document.querySelector(".carousel-nav.next");

  progressEl.innerHTML = photos
    .map((_, idx) => `<span class="dot" data-idx="${idx}"></span>`)
    .join("");

  let current = 0;
  let autoId = null;

  const setSlide = (idx) => {
    current = (idx + photos.length) % photos.length;
    const slide = photos[current];
    imgEl.src = slide.src;
    captionEl.innerHTML = `<strong>${GIRL_NAME}</strong>: ${slide.note}`;
    progressEl.querySelectorAll(".dot").forEach((dot) => {
      dot.classList.toggle("active", Number(dot.dataset.idx) === current);
    });
  };

  const openLightbox = () => {
    lightboxImg.src = photos[current].src;
    lightbox.classList.remove("hidden");
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
  };

  const next = () => setSlide(current + 1);
  const prev = () => setSlide(current - 1);

  navNext.addEventListener("click", next);
  navPrev.addEventListener("click", prev);
  imgEl.addEventListener("click", openLightbox);
  imgEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox();
    }
  });

  progressEl.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => setSlide(Number(dot.dataset.idx)));
  });

  closeBtn.onclick = closeLightbox;
  nextBtn.onclick = () => {
    next();
    openLightbox();
  };
  prevBtn.onclick = () => {
    prev();
    openLightbox();
  };

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") {
      next();
      openLightbox();
    }
    if (e.key === "ArrowLeft") {
      prev();
      openLightbox();
    }
  });

  let touchStartX = 0;
  imgEl.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  imgEl.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) next();
      else prev();
    }
  });

  const startAuto = () => {
    clearInterval(autoId);
    autoId = setInterval(() => setSlide(current + 1), 5200);
  };
  const stopAuto = () => clearInterval(autoId);

  setSlide(0);
  startAuto();
  imgEl.addEventListener("mouseenter", stopAuto);
  imgEl.addEventListener("mouseleave", startAuto);
}

function setupAudioPlayer() {
  const audio = new Audio(AUDIO_SRC);
  audio.preload = "auto";
  const toggleBtn = document.getElementById("audio-toggle");
  const bar = document.getElementById("audio-bar");
  const fill = document.getElementById("audio-fill");
  const currentEl = document.getElementById("audio-current");
  const durationEl = document.getElementById("audio-duration");

  const formatTime = (t) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  const updateProgress = () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    fill.style.inset = `0 ${Math.max(0, 100 - pct)}% 0 0`;
    currentEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  };

  const toggle = () => {
    if (audio.paused) {
      audio.play();
      toggleBtn.textContent = "❚❚";
      toggleBtn.setAttribute("aria-label", "Pausar");
    } else {
      audio.pause();
      toggleBtn.textContent = "▶";
      toggleBtn.setAttribute("aria-label", "Reproducir");
    }
  };

  audio.addEventListener("loadedmetadata", updateProgress);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    toggleBtn.textContent = "▶";
    toggleBtn.setAttribute("aria-label", "Reproducir");
  });

  toggleBtn.addEventListener("click", toggle);
  bar.addEventListener("click", (e) => {
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });
}

// Background particles and celebratory bursts
const stars = [];
const confettiPieces = [];
let ctx, canvas, rafId;

function initBackground() {
  canvas = document.getElementById("fx");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  spawnStars(180);
  animate();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnStars(count) {
  for (let i = 0; i < count; i++) {
    stars.push(makeStar());
  }
}

function makeStar() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.4,
    speed: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.6 + 0.3,
  };
}

function animate() {
  if (fxPaused) {
    rafId = requestAnimationFrame(animate);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "rgba(255, 215, 128, 0.08)");
  gradient.addColorStop(1, "rgba(255, 143, 177, 0.06)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach((s) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 230, 180, ${s.alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = -2;
      s.x = Math.random() * canvas.width;
    }
  });

  // Confetti layer
  for (let i = confettiPieces.length - 1; i >= 0; i--) {
    const p = confettiPieces[i];
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.18;
    p.life -= 1;
    if (p.life <= 0 || p.y > canvas.height + 20) {
      confettiPieces.splice(i, 1);
    }
  }

  rafId = requestAnimationFrame(animate);
}

function burstConfetti(amount = 40, randomOrigin = true) {
  const originX = randomOrigin ? Math.random() * canvas.width : canvas.width / 2;
  const originY = randomOrigin ? Math.random() * canvas.height * 0.6 : canvas.height / 2;
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 9,
      vy: (Math.random() - 0.8) * 11,
      size: Math.random() * 4 + 2,
      life: Math.random() * 80 + 40,
      color: Math.random() > 0.5 ? "#f5d36a" : "#ff8fb1",
    });
  }
}

function startFireworksLoop() {
  if (fireworksInterval) clearInterval(fireworksInterval);
  fireworksInterval = setInterval(() => burstConfetti(45, true), 1600);
}
