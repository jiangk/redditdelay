const DEFAULTS = { waitSecs: 30, unlockMins: 15 };

const waitInput   = document.getElementById('rdb-wait');
const unlockInput = document.getElementById('rdb-unlock');
const saveBtn     = document.getElementById('rdb-save');
const lockNowBtn  = document.getElementById('rdb-lock-now');
const savedEl     = document.getElementById('rdb-saved');
const countdownEl = document.getElementById('rdb-countdown');

// Load saved settings into inputs
chrome.storage.sync.get(DEFAULTS, (settings) => {
  waitInput.value   = settings.waitSecs;
  unlockInput.value = settings.unlockMins;
});

// Save settings
saveBtn.addEventListener('click', () => {
  const waitSecs  = Math.max(1, parseInt(waitInput.value, 10)   || DEFAULTS.waitSecs);
  const unlockMins = Math.max(1, parseInt(unlockInput.value, 10) || DEFAULTS.unlockMins);

  waitInput.value   = waitSecs;
  unlockInput.value = unlockMins;

  chrome.storage.sync.set({ waitSecs, unlockMins }, () => {
    savedEl.textContent = 'Saved.';
    setTimeout(() => { savedEl.textContent = ''; }, 2000);
  });
});

// Live countdown showing time remaining until Reddit locks again
function updateCountdown() {
  chrome.storage.local.get('rdb-unlocked-until', (local) => {
    const unlockedUntil = local['rdb-unlocked-until'];
    const remaining = unlockedUntil ? unlockedUntil - Date.now() : 0;

    if (remaining > 0) {
      const totalSecs = Math.ceil(remaining / 1000);
      const m = Math.floor(totalSecs / 60);
      const s = totalSecs % 60;
      countdownEl.textContent = m > 0
        ? `${m}m ${String(s).padStart(2, '0')}s`
        : `${s}s`;
      countdownEl.classList.remove('locked');
      lockNowBtn.disabled = false;
    } else {
      countdownEl.textContent = 'Locked';
      countdownEl.classList.add('locked');
      lockNowBtn.disabled = true;
    }
  });
}

// Lock Now: clear the unlock timestamp immediately
lockNowBtn.addEventListener('click', () => {
  chrome.storage.local.remove('rdb-unlocked-until', updateCountdown);
});

updateCountdown();
setInterval(updateCountdown, 1000);
