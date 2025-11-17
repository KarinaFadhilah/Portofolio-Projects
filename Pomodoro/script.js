document.addEventListener('DOMContentLoaded', () => {
  const start = document.getElementById('start');
  const pause = document.getElementById('pause');
  const reset = document.getElementById('reset');
  const timer = document.getElementById('timer');
  const title = document.querySelector('.title');

  let timeLeft = 25 * 60;
  let interval = null;
  let isBreak = false;
  let sessionCount = 0;

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  function startPomodoro() {
    timeLeft = 25 * 60;
    alert("Time to focus again!");
    title.textContent = "Pomodoro Timer";
    isBreak = false;
    updateTimer();
    startTimer();
  }

  function startShortBreak() {
    timeLeft = 5 * 60;
    alert("Take a short break!");
    title.textContent = "Short Break ☕";
    isBreak = true;
    updateTimer();
    startTimer();
  }

  function startLongBreak() {
    timeLeft = 15 * 60;
    alert("Take a long break!");
    title.textContent = "Long Break 🧘‍♀️";
    isBreak = true;
    updateTimer();
    startTimer();
  }

  function startTimer() {
    if (interval !== null) return;

    interval = setInterval(() => {
      timeLeft--;
      updateTimer();

      if (timeLeft <= 0) {
        clearInterval(interval);
        interval = null;

        if (!isBreak) {
          sessionCount++;

          if (sessionCount % 4 === 0) {
            startLongBreak();

          } else {
            startShortBreak();
          }
        } else {
          startPomodoro();
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    interval = null;
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;
    isBreak = false;
    timeLeft = 25 * 60;
    sessionCount = 0;
    title.textContent = "Pomodoro Timer";
    updateTimer();
  }

  function setActive(button) {
    buttons.forEach(btn => btn.classList.remove('active')); // hapus semua dulu
    button.classList.add('active'); // tombol yang diklik jadi aktif
  }

  function setActive(button) {
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  }

  start.addEventListener('click', startTimer);
  pause.addEventListener('click', pauseTimer);
  reset.addEventListener('click', resetTimer);

  updateTimer();
});