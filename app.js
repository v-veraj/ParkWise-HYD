const screens = [...document.querySelectorAll(".screen")];
const journeySteps = [...document.querySelectorAll("#journeySteps li")];
const toast = document.querySelector("#toast");
const screenOrder = ["moveinsync", "plan", "recommend", "reserve", "navigate", "garage", "checkin", "parked"];
let currentScreen = "moveinsync";
let reservationSeconds = 600;
let reservationInterval;
let lastDataUpdate = Date.now();
let deferredInstallPrompt;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setJourneyStep(step) {
  document.querySelector("main").classList.toggle("integration-home", step < 0);
  document.querySelector(".journey-panel").classList.toggle("hidden", step < 0);
  journeySteps.forEach((item, index) => {
    item.classList.toggle("active", index === step);
    item.classList.toggle("done", index < step);
  });
}

async function enterParkWise() {
  const context = await window.moveInSyncAdapter.getArrivalIntent();
  document.querySelector("#destination").value = context.destination;
  document.querySelector("#arrivalTime").value = context.arrivalTime;
  await window.moveInSyncAdapter.publishParkingStatus("parking_started", {
    destination: context.destination,
    arrivalTime: context.arrivalTime
  });
  showScreen("plan", 0);
  showToast("Trip context shared from employee app");
}

function showScreen(name, journeyStep) {
  currentScreen = name;
  screens.forEach(screen => screen.classList.toggle("active", screen.dataset.screen === name));
  setJourneyStep(journeyStep);
}

function formatClock(date) {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function updateClock() {
  document.querySelector("#clock").textContent = formatClock(new Date());
  const seconds = Math.floor((Date.now() - lastDataUpdate) / 1000);
  document.querySelector("#updatedSeconds").textContent = seconds < 2 ? "now" : `${seconds}s ago`;
}

function formatReservationTime() {
  const time = document.querySelector("#arrivalTime").value || "10:00";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  document.querySelector("#reservationArrival").textContent =
    `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function buildBayGrid() {
  const grid = document.querySelector("#bayGrid");
  const occupied = new Set([2, 4, 6, 9, 11, 14, 19]);
  const accessible = new Set([1, 5]);
  grid.innerHTML = "";
  for (let bay = 1; bay <= 20; bay += 1) {
    const item = document.createElement("div");
    item.className = "bay";
    if (occupied.has(bay)) item.classList.add("occupied");
    if (accessible.has(bay)) item.classList.add("accessible");
    if (bay === 17) item.classList.add("selected");
    item.textContent = `B-${String(bay).padStart(2, "0")}`;
    grid.appendChild(item);
  }
}

function startReservationTimer() {
  window.clearInterval(reservationInterval);
  reservationSeconds = 600;
  reservationInterval = window.setInterval(() => {
    reservationSeconds = Math.max(0, reservationSeconds - 1);
    const minutes = String(Math.floor(reservationSeconds / 60)).padStart(2, "0");
    const seconds = String(reservationSeconds % 60).padStart(2, "0");
    document.querySelector("#reservationTimer").textContent = `${minutes}:${seconds}`;
  }, 1000);
}

document.querySelector("#tripForm").addEventListener("submit", event => {
  event.preventDefault();
  formatReservationTime();
  showScreen("recommend", 1);
  showToast("Copilot evaluated 3 parking zones");
  window.moveInSyncAdapter.publishParkingStatus("recommendation_created", {
    facility: "MLCP",
    level: "4",
    zone: "B"
  });
});

document.querySelector("#chooseRecommended").addEventListener("click", () => {
  buildBayGrid();
  showScreen("reserve", 2);
  showToast("Bay B-17 selected near the east elevator");
});

document.querySelector("#confirmReservation").addEventListener("click", () => {
  showScreen("navigate", 3);
  startReservationTimer();
  showToast("Reservation PW-2048 confirmed");
  window.moveInSyncAdapter.publishParkingStatus("parking_reserved", {
    reservationId: "PW-2048",
    bay: "B-17",
    expiresInSeconds: 600
  });
});

document.querySelector("#arriveGate").addEventListener("click", () => {
  showScreen("garage", 3);
  showToast("Gate 3 entry confirmed · Guidance switched to garage mode");
  window.moveInSyncAdapter.publishParkingStatus("campus_arrival", { gate: "Gate 3" });
});

document.querySelector("#parkCar").addEventListener("click", () => {
  showScreen("checkin", 4);
  showToast("Vehicle detected at the reserved bay");
});

document.querySelector("#scanQr").addEventListener("click", event => {
  event.currentTarget.textContent = "✓ Check-in confirmed";
  event.currentTarget.disabled = true;
  window.clearInterval(reservationInterval);
  showToast("Bay B-17 marked occupied · Reservation completed");
  window.moveInSyncAdapter.publishParkingStatus("parking_completed", {
    reservationId: "PW-2048",
    location: "MLCP Level 4 Zone B Bay B-17"
  });
  window.setTimeout(() => showScreen("parked", 5), 1000);
});

document.querySelector("#routeBuilding").addEventListener("click", () => {
  showToast("Walking route: East elevator → Level 1 → Building 4 walkway");
});

document.querySelector("#findCar").addEventListener("click", () => {
  document.querySelector("#returnCard").classList.add("show");
  showToast("Return route opened");
});

document.querySelector("#restartDemo").addEventListener("click", () => {
  window.clearInterval(reservationInterval);
  document.querySelector("#returnCard").classList.remove("show");
  const scanButton = document.querySelector("#scanQr");
  scanButton.disabled = false;
  scanButton.innerHTML = 'Simulate QR scan <span class="scan-icon">⌗</span>';
  showScreen("plan", 0);
  showToast("Demo reset");
});

document.querySelector("#openParkWise").addEventListener("click", enterParkWise);
document.querySelector("#scheduleCab").addEventListener("click", () => {
  showToast("Transport booking stays in MoveInSync");
});
document.querySelector("#returnMoveInSync").addEventListener("click", async () => {
  await window.moveInSyncAdapter.openTransportHome();
  showScreen("moveinsync", -1);
  showToast("Parking status synced to employee app");
});

window.setInterval(() => {
  if (!["recommend", "reserve"].includes(currentScreen)) return;
  const level4 = document.querySelector("#level4Spaces");
  const level5 = document.querySelector("#level5Spaces");
  level4.textContent = Math.max(8, Math.min(18, Number(level4.textContent) + (Math.random() > 0.55 ? -1 : 1)));
  level5.textContent = Math.max(5, Math.min(13, Number(level5.textContent) + (Math.random() > 0.5 ? -1 : 1)));
  lastDataUpdate = Date.now();
}, 6000);

window.setInterval(updateClock, 1000);
buildBayGrid();
updateClock();
setJourneyStep(-1);

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.querySelector("#installApp").hidden = false;
});

document.querySelector("#installApp").addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    showToast("Use your browser menu and choose Add to Home screen");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.querySelector("#installApp").hidden = true;
});

window.addEventListener("appinstalled", () => {
  document.querySelector("#installApp").hidden = true;
  showToast("ParkWise installed");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      showToast("Offline mode could not be enabled");
    });
  });
}
