// =====================================================
// MENU MOBILE
// =====================================================

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav-links");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

nav?.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});


// =====================================================
// ANIMAÇÕES AO ROLAR
// =====================================================

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

reveals.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min((i % 4) * 80, 240)}ms`;
  observer.observe(el);
});


// =====================================================
// CONFIRMAÇÃO DE PRESENÇA
// =====================================================

const peopleWrap = document.getElementById("peopleWrap");
const booksWrap = document.getElementById("booksWrap");


// Presença
document.querySelectorAll('input[name="presenca"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const yes = e.target.value === "Sim";

    peopleWrap?.classList.toggle("show", yes);

    const pessoas = document.getElementById("pessoas");

    if (pessoas) {
      pessoas.required = yes;

      if (!yes) {
        pessoas.value = "";
      }
    }
  });
});


// Reserva do livro
document.querySelectorAll('input[name="livro"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const yes = e.target.value === "Sim";

    booksWrap?.classList.toggle("show", yes);

    const exemplares = document.getElementById("exemplares");

    if (exemplares) {
      exemplares.required = yes;

      if (!yes) {
        exemplares.value = "";
      }
    }
  });
});


// =====================================================
// ENVIO DO RSVP PARA O WHATSAPP
// =====================================================

const rsvpForm = document.getElementById("rsvpForm");

rsvpForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome")?.value.trim();

  const presenca = document.querySelector(
    'input[name="presenca"]:checked'
  )?.value;

  const pessoas = document.getElementById("pessoas")?.value;

  const livro = document.querySelector(
    'input[name="livro"]:checked'
  )?.value;

  const exemplares = document.getElementById("exemplares")?.value;

  if (!nome || !presenca || !livro) {
    e.currentTarget.reportValidity();
    return;
  }

  const msg = `Olá! Gostaria de responder ao convite do lançamento do livro Almas Gêmeas e da celebração dos 28 anos de casamento de Jorge e Ariela.

Nome: ${nome}

Presença: ${presenca}

Quantidade de pessoas: ${
    presenca === "Sim" ? pessoas : "Não se aplica"
  }

Deseja reservar o livro: ${livro}

Quantidade de exemplares: ${
    livro === "Sim" ? exemplares : "Não se aplica"
  }

Obrigado!`;

  const url =
    "https://wa.me/5561996529417?text=" +
    encodeURIComponent(msg);

  window.open(url, "_blank", "noopener");
});


// =====================================================
// MÚSICA — YOUTUBE
// =====================================================

// Vídeo escolhido:
// https://www.youtube.com/watch?v=ng2Ua9bk1Pg

const musicToggle = document.getElementById("musicToggle");
const youtubeMusic = document.getElementById("youtubeMusic");
const musicLabel = document.getElementById("musicLabel");

let ytPlayer = null;
let musicReady = false;


// Esta função é chamada automaticamente pela API do YouTube
function onYouTubeIframeAPIReady() {

  if (!youtubeMusic) {
    console.warn("Elemento #youtubeMusic não encontrado.");
    return;
  }

  ytPlayer = new YT.Player("youtubeMusic", {

    // VÍDEO CORRETO
    videoId: "ng2Ua9bk1Pg",

    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1
    },

    events: {

      onReady: () => {
        musicReady = true;

        if (musicLabel) {
          musicLabel.textContent = "Ativar música";
        }
      },

      onStateChange: (event) => {

        // Tocando
        if (
          event.data === YT.PlayerState.PLAYING
        ) {

          musicToggle?.setAttribute(
            "aria-pressed",
            "true"
          );

          if (musicLabel) {
            musicLabel.textContent = "Pausar música";
          }
        }

        // Pausado ou terminado
        if (
          event.data === YT.PlayerState.PAUSED ||
          event.data === YT.PlayerState.ENDED
        ) {

          musicToggle?.setAttribute(
            "aria-pressed",
            "false"
          );

          if (musicLabel) {
            musicLabel.textContent = "Ativar música";
          }
        }
      }
    }
  });
}


// =====================================================
// BOTÃO DA MÚSICA
// =====================================================

musicToggle?.addEventListener("click", () => {

  if (!musicReady || !ytPlayer) {
    console.warn("O player do YouTube ainda não está pronto.");
    return;
  }

  const state = ytPlayer.getPlayerState();

  if (state === YT.PlayerState.PLAYING) {

    ytPlayer.pauseVideo();

    musicToggle.setAttribute(
      "aria-pressed",
      "false"
    );

    if (musicLabel) {
      musicLabel.textContent = "Ativar música";
    }

  } else {

    ytPlayer.playVideo();

    musicToggle.setAttribute(
      "aria-pressed",
      "true"
    );

    if (musicLabel) {
      musicLabel.textContent = "Pausar música";
    }
  }
});


// =====================================================
// CARREGAR API DO YOUTUBE
// =====================================================

const ytApiScript = document.createElement("script");

ytApiScript.src =
  "https://www.youtube.com/iframe_api";

document.head.appendChild(ytApiScript);
