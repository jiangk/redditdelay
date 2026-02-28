(function () {
  // Skip subframes (e.g. embedded Reddit widgets on other sites)
  if (window.top !== window.self) return;

  const DEFAULTS = { waitSecs: 30, unlockMins: 15 };

  chrome.storage.sync.get(DEFAULTS, (settings) => {
    chrome.storage.local.get('rdb-unlocked-until', (local) => {
      const unlockedUntil = local['rdb-unlocked-until'];
      if (unlockedUntil && Date.now() < unlockedUntil) return;

      showOverlay(settings.waitSecs, settings.unlockMins);
    });
  });

  function showOverlay(waitSecs, unlockMins) {
    const overlay = document.createElement('div');
    overlay.id = 'rdb-overlay';

    overlay.innerHTML = `
      <div id="rdb-box">
        <div id="rdb-timer">${waitSecs}</div>
        <p id="rdb-label">seconds before Reddit</p>
        <p id="rdb-sub">Are you sure you want to be here?</p>
        <button id="rdb-back">&#8592; Go back</button>
        <p id="rdb-reset-msg"></p>
      </div>
    `;

    (document.documentElement || document.body || document).appendChild(overlay);

    document.getElementById('rdb-back').addEventListener('click', () => {
      history.length > 1 ? history.back() : window.close();
    });

    let seconds = waitSecs;
    const timerEl = document.getElementById('rdb-timer');
    const resetMsgEl = document.getElementById('rdb-reset-msg');

    let intervalId = null;
    let wasReset = false;
    let resetMsgTimeoutId = null;

    function tick() {
      seconds -= 1;
      timerEl.textContent = seconds;
      if (seconds <= 0) {
        stop();
        cleanup();
        chrome.storage.local.set({ 'rdb-unlocked-until': Date.now() + unlockMins * 60 * 1000 });
        overlay.remove();
      }
    }

    function stop() {
      clearInterval(intervalId);
      intervalId = null;
    }

    function resetTimer() {
      if (seconds < waitSecs) wasReset = true;
      stop();
      seconds = waitSecs;
      timerEl.textContent = seconds;
    }

    function startTicking() {
      if (intervalId || document.hidden || !document.hasFocus()) return;
      if (wasReset) {
        wasReset = false;
        showResetMessage();
      }
      intervalId = setInterval(tick, 1000);
    }

    function showResetMessage() {
      clearTimeout(resetMsgTimeoutId);
      resetMsgEl.textContent = 'Timer reset — stay focused!';
      resetMsgEl.style.opacity = '1';
      resetMsgTimeoutId = setTimeout(() => { resetMsgEl.style.opacity = '0'; }, 2500);
    }

    function cleanup() {
      clearTimeout(resetMsgTimeoutId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', startTicking);
      window.removeEventListener('blur', resetTimer);
    }

    function onVisibilityChange() {
      document.hidden ? resetTimer() : startTicking();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', startTicking);
    window.addEventListener('blur', resetTimer);

    startTicking();
  }
})();
