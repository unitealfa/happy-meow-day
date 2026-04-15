const phrases = [...document.querySelectorAll(".phrase")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const EXIT_DURATION_MS = 820;
const CROSSFADE_OFFSET_MS = 170;
const START_DELAY_MS = 250;
const WAIT_SPEED_MULTIPLIER = 0.5;

const wait = (duration) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

function getPhraseText(phrase) {
  return [...phrase.querySelectorAll(".line")]
    .map((line) => line.textContent.replace(/\s+/g, " ").trim())
    .join(" ")
    .trim();
}

function computeReadDuration(phrase) {
  const minimum = Number(phrase.dataset.minDuration || 2200);
  const text = phrase.dataset.text || "";
  const words = text ? text.split(/\s+/).length : 0;
  const characters = text.length;

  // Base simple de lecture: assez lente pour laisser respirer le texte.
  const estimated = 850 + words * 700 + characters * 22;
  return Math.max(minimum, estimated) * WAIT_SPEED_MULTIPLIER;
}

function splitLineIntoCharacters(line, collector) {
  const rawText = line.textContent;
  line.textContent = "";

  for (const character of rawText) {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = character === " " ? "\u00A0" : character;
    collector.push(span);
    line.appendChild(span);
  }
}

function preparePhrases() {
  phrases.forEach((phrase) => {
    const phraseText = getPhraseText(phrase);
    const characters = [];

    phrase.dataset.text = phraseText;
    phrase.dataset.displayDuration = String(computeReadDuration(phrase));

    [...phrase.querySelectorAll(".line")].forEach((line) => {
      splitLineIntoCharacters(line, characters);
    });

    characters.forEach((character, index) => {
      character.style.setProperty("--char-index", index);
      character.style.setProperty(
        "--char-reverse-index",
        characters.length - index
      );
    });
  });
}

function showPhrase(phrase) {
  phrase.classList.remove("exit");
  phrase.classList.add("active");
}

function hidePhrase(phrase) {
  phrase.classList.remove("active");
  phrase.classList.add("exit");
}

function resetPhrases() {
  phrases.forEach((phrase) => {
    phrase.classList.remove("active", "exit");
  });
}

async function runSequence() {
  if (!phrases.length) {
    return;
  }

  await wait(reducedMotion.matches ? 0 : START_DELAY_MS);
  showPhrase(phrases[0]);

  for (let index = 0; index < phrases.length; index += 1) {
    const currentPhrase = phrases[index];
    const nextPhrase = phrases[index + 1];
    const displayDuration = reducedMotion.matches
      ? Number(currentPhrase.dataset.minDuration || 2000) *
        WAIT_SPEED_MULTIPLIER
      : Number(currentPhrase.dataset.displayDuration);

    await wait(displayDuration);

    if (!nextPhrase) {
      return;
    }

    hidePhrase(currentPhrase);
    await wait(reducedMotion.matches ? 0 : CROSSFADE_OFFSET_MS);
    showPhrase(nextPhrase);
    await wait(
      reducedMotion.matches ? 0 : EXIT_DURATION_MS - CROSSFADE_OFFSET_MS
    );
  }
}

window.addEventListener("load", () => {
  preparePhrases();
  runSequence();
});
