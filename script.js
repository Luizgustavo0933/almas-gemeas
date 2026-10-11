const menuBtn=document.querySelector(".menu-btn"),nav=document.querySelector(".nav-links");
menuBtn?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open)});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

const reveals=document.querySelectorAll(".reveal");
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
reveals.forEach((el,i)=>{el.style.transitionDelay=`${Math.min((i%4)*80,240)}ms`;observer.observe(el)});

const peopleWrap=document.getElementById("peopleWrap"), booksWrap=document.getElementById("booksWrap");
document.querySelectorAll('input[name="presenca"]').forEach(r=>r.addEventListener("change",e=>{
  const yes=e.target.value==="Sim"; peopleWrap.classList.toggle("show",yes);
  document.getElementById("pessoas").required=yes;
  if(!yes){document.getElementById("pessoas").value=""}
}));
document.querySelectorAll('input[name="livro"]').forEach(r=>r.addEventListener("change",e=>{
  const yes=e.target.value==="Sim"; booksWrap.classList.toggle("show",yes);
  document.getElementById("exemplares").required=yes;
  if(!yes){document.getElementById("exemplares").value=""}
}));

document.getElementById("rsvpForm").addEventListener("submit",e=>{
  e.preventDefault();
  const nome=document.getElementById("nome").value.trim();
  const presenca=document.querySelector('input[name="presenca"]:checked')?.value;
  const pessoas=document.getElementById("pessoas").value;
  const livro=document.querySelector('input[name="livro"]:checked')?.value;
  const exemplares=document.getElementById("exemplares").value;
  if(!nome||!presenca||!livro){e.currentTarget.reportValidity();return}
  const msg=`Olá! Gostaria de responder ao convite do lançamento do livro Almas Gêmeas e da celebração dos 28 anos de casamento de Jorge e Ariela.

Nome: ${nome}

Presença: ${presenca}

Quantidade de pessoas: ${presenca==="Sim"?pessoas:"Não se aplica"}

Deseja reservar o livro? ${livro}

Quantidade de exemplares: ${livro==="Sim"?exemplares:"Não se aplica"}

Obrigado!`;
  const url="https://wa.me/5561996529417?text="+encodeURIComponent(msg);
  window.open(url,"_blank","noopener");
});

// Música ambiente romântica: sintetizada no navegador, sem arquivo externo.
// Por política dos navegadores, ela começa quando o visitante toca no botão.
let audioCtx=null, master=null, musicTimer=null, musicOn=false;
const toggle=document.getElementById("musicToggle");
const notes=[261.63,329.63,392.00,523.25,392.00,329.63,293.66,349.23,440.00,523.25,440.00,349.23];
function startMusic(){
  if(musicOn) return;
  audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  master=audioCtx.createGain(); master.gain.value=.035; master.connect(audioCtx.destination);
  const now=audioCtx.currentTime;
  let step=0;
  const play=()=>{
    const t=audioCtx.currentTime;
    const freq=notes[step%notes.length];
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.0001,t);
    gain.gain.exponentialRampToValueAtTime(.18,t+.08);
    gain.gain.exponentialRampToValueAtTime(.0001,t+2.1);
    osc.connect(gain); gain.connect(master); osc.start(t); osc.stop(t+2.2);
    // a soft lower harmony every fourth note
    if(step%4===0){
      const bass=audioCtx.createOscillator(), bg=audioCtx.createGain();
      bass.type="sine"; bass.frequency.value=freq/2;
      bg.gain.setValueAtTime(.0001,t); bg.gain.exponentialRampToValueAtTime(.045,t+.1); bg.gain.exponentialRampToValueAtTime(.0001,t+2.4);
      bass.connect(bg); bg.connect(master); bass.start(t); bass.stop(t+2.5);
    }
    step++;
  };
  play(); musicTimer=setInterval(play,1800); musicOn=true;
  toggle.setAttribute("aria-pressed","true"); toggle.querySelector("span").textContent="Música ativada";
}
function stopMusic(){
  if(!musicOn)return;
  clearInterval(musicTimer); musicTimer=null;
  master?.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.5);
  setTimeout(()=>{audioCtx?.close();audioCtx=null;master=null},650);
  musicOn=false; toggle.setAttribute("aria-pressed","false"); toggle.querySelector("span").textContent="Música ambiente";
}
toggle?.addEventListener("click",()=>musicOn?stopMusic():startMusic());


const musicToggle = document.getElementById("musicToggle");
const youtubeMusic = document.getElementById("youtubeMusic");
const musicLabel = document.getElementById("musicLabel");

let ytPlayer = null;
let musicReady = false;

function onYouTubeIframeAPIReady(){
  ytPlayer = new YT.Player("youtubeMusic", {
    events: {
      onReady: () => { musicReady = true; }
    }
  });
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (!musicReady || !ytPlayer) return;
    const state = ytPlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Ativar música";
    } else {
      ytPlayer.playVideo();
      musicToggle.setAttribute("aria-pressed", "true");
      musicLabel.textContent = "Pausar música";
    }
  });
}

const ytApiScript=document.createElement("script");ytApiScript.src="https://www.youtube.com/iframe_api";document.head.appendChild(ytApiScript);
