const gifStages = [
  "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif", // 0 normal
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif", // 1 confused
  "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif", // 2 pleading
  "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif", // 3 sad
  "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif", // 4 sadder
  "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif", // 5 devastated
  "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif", // 6 very devastated
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif", // 7 crying runaway
];

const noMessages = [
  "No",
  "Error: 3-year contract still active. 🛠️",
  "Pookie, renewal is mandatory! 🥺",
  "Your 'Single Life' trial has expired. ⏳",
  "Access Denied: Try the 'Yes' button instead. 🚫",
  "Processing... Just click Yes already! 🤖",
  "You're 1,095 days too late to say no! ❤️",
  "Last chance to renew without a late fee! 💸",
  "Still trying? I admire the persistence! 😜",
];

const yesTeasePokes = [
  "Don't click Yes yet... try to hit No first! 😏",
  "I bet you can't even touch the No button. 👀",
  "Just one click on No, come on... 😈",
];

let yesTeasedCount = 0;

let noClickCount = 0;
let runawayEnabled = false;
let musicPlaying = true;

const catGif = document.getElementById("cat-gif");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const music = document.getElementById("bg-music");

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true;
music.volume = 0.3;
music
  .play()
  .then(() => {
    music.muted = false;
  })
  .catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener(
      "click",
      () => {
        music.muted = false;
        music.play().catch(() => {});
      },
      { once: true },
    );
  });

function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    document.getElementById("music-toggle").textContent = "🔇";
  } else {
    music.muted = false;
    music.play();
    musicPlaying = true;
    document.getElementById("music-toggle").textContent = "🔊";
  }
}

function handleYesClick() {
  if (!runawayEnabled) {
    // Tease her to try No first
    const msg =
      yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)];
    yesTeasedCount++;
    showTeaseMessage(msg);
    return;
  }
  window.location.href = "yes.html";
}

function showTeaseMessage(msg) {
  let toast = document.getElementById("tease-toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function handleNoClick() {
  document.getElementById("tease-toast").classList.remove("show");
  noClickCount++;

  const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
  const maxFontSize = 55; // Hard cap so it stays side-by-side

  if (currentSize < maxFontSize) {
    yesBtn.style.fontSize = `${currentSize * 1.1}px`;
  }

  const padY = Math.min(15 + noClickCount * 3, 35);
  const padX = Math.min(35 + noClickCount * 6, 65);
  yesBtn.style.padding = `${padY}px ${padX}px`;

  const msgIndex = Math.min(noClickCount, noMessages.length - 1);
  noBtn.textContent = noMessages[msgIndex];

  swapGif(gifStages[Math.min(noClickCount, gifStages.length - 1)]);

  // Trigger runaway once the messages reach the end
  if (noClickCount >= noMessages.length - 1 && !runawayEnabled) {
    runawayEnabled = true;
    enableRunaway();
    runAway(); // Initial jump
  }
}

function swapGif(src) {
  catGif.style.opacity = "0";
  setTimeout(() => {
    catGif.src = src;
    catGif.style.opacity = "1";
  }, 200);
}

function enableRunaway() {
  // mouseover is faster than click - it moves BEFORE they can press down
  noBtn.addEventListener("mouseover", runAway);
  noBtn.addEventListener("touchstart", runAway, { passive: true });

  // Back-up: if they are super fast, move it on click too
  noBtn.addEventListener("click", (e) => {
    if (runawayEnabled) {
      e.preventDefault();
      runAway();
    }
  });
}

function runAway() {
  const margin = 50; // Increased margin so it doesn't get stuck in corners
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;

  const maxX = window.innerWidth - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;

  const randomX = Math.max(margin, Math.random() * maxX);
  const randomY = Math.max(margin, Math.random() * maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;
  noBtn.style.zIndex = "1000";

  // FIXED: Removed the opacity vanishing logic here
  noBtn.style.opacity = "1";
}
