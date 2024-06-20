document.addEventListener("DOMContentLoaded", () => {
  const boostButton = document.getElementById("boost-button");
  const friendButton = document.getElementById("friend-button");
  const taskButton = document.getElementById("task-button");
  const rankButton = document.getElementById("rank-button");
  const claimButton = document.getElementById("claim-button");
  const countdownTimerElement = document.getElementById("countdown-timer");
  const coinCountElement = document.getElementById("coin-count");
  const nextCollectElement = document.getElementById("next-collect");
  const friendCountElement = document.getElementById("friend-count");
  const friendEarningsElement = document.getElementById("friend-earnings");
  const inviteCodeElement = document.getElementById("invite-code");
  const inviteInputElement = document.getElementById("invite-input");
  const submitInviteButton = document.getElementById("submit-invite");

  const mainContainer = document.getElementById("main-container");
  const gameContainer = document.getElementById("game-container");
  const friendContainer = document.getElementById("friend-container");
  const taskContainer = document.getElementById("task-container");
  const rankContainer = document.getElementById("rank-container");

  const friendInviteCodeElement = document.getElementById("friend-invite-code");
  const friendInviteInputElement = document.getElementById(
    "friend-invite-input"
  );
  const friendSubmitInviteButton = document.getElementById(
    "friend-submit-invite"
  );
  const homeButtons = document.querySelectorAll(".nav-button");

  const tasksElement = document.getElementById("task-list");
  const ranksElement = document.getElementById("rank-list");

  let coins = 0;
  let collectInterval = 7200; // 2 hours in seconds
  let mineRate = 1; // coins per interval
  let friends = 0;
  let friendCoins = 0;
  let inviteCode = generateInviteCode();
  let tasks = [
    {
      id: 1,
      description: "Follow our YouTube channel",
      link: "https://www.youtube.com",
      completed: false,
    },
    {
      id: 2,
      description: "Follow our Twitter page",
      link: "https://twitter.com",
      completed: false,
    },
  ];
  let players = [
    { name: "Player 1", coins: 5000, inviteCode: "ABC123" },
    { name: "Player 2", coins: 3000, inviteCode: "DEF456" },
    { name: "Player 3", coins: 2000, inviteCode: "GHI789" },
  ]; // This should be dynamically fetched from a server in a real game

  let countdown = collectInterval;

  function generateInviteCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  function updateUI() {
    coinCountElement.textContent = `Coins: ${coins}`;
    nextCollectElement.textContent = `Next collect: ${
      collectInterval / 3600
    } hours`;
    friendCountElement.textContent = `Friends: ${friends}`;
    friendEarningsElement.textContent = `Earnings from friends: ${friendCoins.toFixed(
      2
    )}`;
    inviteCodeElement.textContent = `Your Invite Code: ${inviteCode}`;
    friendInviteCodeElement.textContent = `Your Invite Code: ${inviteCode}`;

    tasksElement.innerHTML = "";
    tasks.forEach((task) => {
      if (!task.completed) {
        let li = document.createElement("li");
        let button = document.createElement("button");
        button.textContent = task.description;
        button.addEventListener("click", () => completeTask(task.id));
        li.appendChild(button);
        tasksElement.appendChild(li);
      }
    });

    players.sort((a, b) => b.coins - a.coins);
    ranksElement.innerHTML = "";
    players.forEach((player, index) => {
      let li = document.createElement("li");
      li.textContent = `${index + 1}. ${player.name}: ${player.coins} coins`;
      ranksElement.appendChild(li);
    });
  }

  function collectCoins() {
    coins += mineRate;
    coins += friendCoins; // Add coins earned by friends
    updateUI();
  }

  function completeTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = true;
      coins += 1000;
      updateUI();
      window.open(task.link, "_blank");
    }
  }

  function navigateTo(container) {
    gameContainer.classList.add("hidden");
    friendContainer.classList.add("hidden");
    taskContainer.classList.add("hidden");
    rankContainer.classList.add("hidden");
    container.classList.remove("hidden");
  }

  boostButton.addEventListener("click", () => {
    if (coins >= 10) {
      coins -= 10;
      mineRate += 1;
      updateUI();
    }
  });

  friendButton.addEventListener("click", () => {
    navigateTo(friendContainer);
  });

  taskButton.addEventListener("click", () => {
    navigateTo(taskContainer);
  });

  rankButton.addEventListener("click", () => {
    navigateTo(rankContainer);
  });

  claimButton.addEventListener("click", () => {
    coins += mineRate;
    countdown = collectInterval;
    claimButton.disabled = true;
    updateUI();
  });

  submitInviteButton.addEventListener("click", () => {
    const enteredCode = inviteInputElement.value;
    const player = players.find((p) => p.inviteCode === enteredCode);
    if (player) {
      coins += 1000;
      player.coins += 1000 * 0.05;
      updateUI();
    }
  });

  friendSubmitInviteButton.addEventListener("click", () => {
    const enteredCode = friendInviteInputElement.value;
    const player = players.find((p) => p.inviteCode === enteredCode);
    if (player) {
      coins += 1000;
      player.coins += 1000 * 0.05;
      friends += 1;
      friendCoins += mineRate * 0.05;
      updateUI();
    }
  });

  homeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navigateTo(gameContainer);
    });
  });

  function countdownTimer() {
    if (countdown > 0) {
      countdown--;
      countdownTimerElement.textContent = `Next claim in: ${Math.floor(
        countdown / 3600
      )}h ${Math.floor((countdown % 3600) / 60)}m ${countdown % 60}s`;
    } else {
      claimButton.disabled = false;
      countdownTimerElement.textContent = "You can now claim your coins!";
    }
  }

  updateUI();
  setInterval(countdownTimer, 1000); // Update countdown timer every second
  setInterval(collectCoins, collectInterval * 1000); // Collect coins every interval
});
