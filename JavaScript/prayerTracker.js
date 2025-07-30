
import { db, doc, setDoc, getDoc, } from "../Firebase/firebase.js"

const NamazContainer = document.getElementById("NamazContainer");
const cityDropdown = document.getElementById("cityDropdown");
const uid = localStorage.getItem("uid");
const currentDate = moment().format("DD-MM-YYYY");

const fetchPrayerTimes = async (city) => {
  const country = 'Pakistan';

  try {
    const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
    const data = await response.json();
    const times = data.data.timings;

    const prayers = [
      { name: "Fajr", time: moment(times.Fajr, "HH:mm").format("hh:mm A") },
      { name: "Dhuhr", time: moment(times.Dhuhr, "HH:mm").format("hh:mm A") },
      { name: "Asr", time: moment(times.Asr, "HH:mm").format("hh:mm A") },
      { name: "Maghrib", time: moment(times.Maghrib, "HH:mm").format("hh:mm A") },
      { name: "Isha", time: moment(times.Isha, "HH:mm").format("hh:mm A") }
    ];

  
    await checkAndCreateTrackingDoc(prayers);

   
    displayNamaz(prayers);
  } catch (error) {
    console.error("Failed to fetch prayer times:", error);
    NamazContainer.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to fetch prayer times</td></tr>`;
  }
};


const checkAndCreateTrackingDoc = async (prayers) => {
  const docRef = doc(db, "users", uid, "namazTracking", currentDate);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const namazStatus = {};
    prayers.forEach(prayer => {
      namazStatus[prayer.name] = "Pending";
    });

    await setDoc(docRef, {
      date: currentDate,
      prayers: namazStatus
    });
  }
};

const displayNamaz = async (namazArray) => {
  NamazContainer.innerHTML = "";

  const docRef = doc(db, "users", uid, "namazTracking", currentDate);
  const docSnap = await getDoc(docRef);
  const statusData = docSnap.data()?.prayers || {};

  namazArray.forEach((namaz, index) => {
    const status = statusData[namaz.name] || "Pending";
    const isCompleted = status === "Completed";

    NamazContainer.innerHTML += `
      <tr id="row-${index}">
        <td class="text-center fw-bold">${namaz.name}</td>
        <td class="text-center text-muted">${namaz.time}</td>
        <td class="text-center" id="status-${index}">
          <span class="badge ${isCompleted ? 'bg-success' : 'bg-warning text-dark'} rounded-pill">
            <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-clock'} me-1"></i> ${status}
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm ${isCompleted ? 'btn-success' : 'btn-outline-success'}" 
                  onclick="markCompleted(${index})" 
                  ${isCompleted ? 'disabled' : ''}>
            <i class="fas ${isCompleted ? 'fa-check-double' : 'fa-check'}"></i>
            ${isCompleted ? '' : 'Mark'}
          </button>
        </td>
      </tr>
    `;
  });
};

window.markCompleted = async (index) => {
  const row = document.getElementById(`row-${index}`);
  const name = row.children[0].innerText;
  // console.log(row);
  // console.log(name);
  

  // Update Firestore
  const docRef = doc(db, "users", uid, "namazTracking", currentDate);
  await setDoc(docRef, {
    prayers: {
      [name]: "Completed"
    }
  }, { merge: true });

  // Update UI
  const statusCell = document.getElementById(`status-${index}`);
  statusCell.innerHTML = `
    <span class="badge bg-success rounded-pill">
      <i class="fas fa-check-circle me-1"></i> Completed
    </span>
  `;

  const button = row.querySelector("button");
  button.disabled = true;
  button.classList.remove("btn-outline-success");
  button.classList.add("btn-success");
  button.innerHTML = `<i class="fas fa-check-double"></i>`;
};


document.addEventListener("DOMContentLoaded", () => {
  fetchPrayerTimes(cityDropdown.value);
});


cityDropdown.addEventListener("change", () => {
  fetchPrayerTimes(cityDropdown.value);
});


const today = moment();
const gregorian = today.format('DD MMMM YYYY');
document.getElementById("date-output").innerText = gregorian;