import { auth, getDocs, collection, db, doc, setDoc, getDoc, onAuthStateChanged } from "../Firebase/firebase.js";

let mainContent = document.getElementById("mainContent");
let namazHistory = document.getElementById("namaz-history");
const uid = localStorage.getItem("uid");

let userCreatedAt = null;

const getDateRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(moment(current).format("DD-MM-YYYY"));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};


const renderHistoryPage = () => {
  mainContent.innerHTML = `
    <div class="container my-4">
      <h2 class="text-center mb-4">📖 Namaz Tracker History</h2>
      <div class="d-flex justify-content-center mb-4">
        <select id="history-type" class="form-select w-50">
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="all">All</option>
        </select>
      </div>
      <div id="namaz-history-cards" class="row g-4"></div>
      <div class="mt-5">
        <h4>Missing Dates <span style="font-weight: normal; font-size: 14px;">(These are the dates since you created your account)</span></h4>
        <div id="missing-dates"></div>
      </div>
    </div>`;

  const dropdown = document.getElementById("history-type");
  dropdown.addEventListener("change", (e) => {
    const selected = e.target.value;
    loadNamazData(selected);
  });

  loadNamazData("7");
};


const loadNamazData = async (filter) => {
  let startDate;

  if (filter === "all") {
    startDate = userCreatedAt;
  } else {
    const calculated = new Date();
    calculated.setDate(calculated.getDate() - parseInt(filter));

    startDate = calculated < userCreatedAt ? userCreatedAt : calculated;
  }

  const allDates = getDateRange(startDate, new Date());

  const querySnapshot = await getDocs(collection(db, "users", uid, "namazTracking"));
  const existingDates = [];
  let historyMap = {};

  querySnapshot.forEach((doc) => {
    historyMap[doc.id] = doc.data();
    existingDates.push(doc.id);
  });

  let filteredDates = allDates.filter(d => existingDates.includes(d));
  let missingDates = allDates.filter(d => !existingDates.includes(d));

  // Cards
  let historyCards = "";
  for (const date of filteredDates) {
    const { prayers } = historyMap[date];
    let prayerList = "";

    for (const [name, status] of Object.entries(prayers)) {
      let badgeClass = "bg-secondary";
      let isClickable = "";

      if (status === "Completed") badgeClass = "bg-success";
      else if (status === "Pending") {
        badgeClass = "bg-warning";
        isClickable = `onclick="markQaza('${date}', '${name}')" style="cursor:pointer"`;
      } else if (status === "Missing") badgeClass = "bg-danger";
      else if (status === "Qaza Done") badgeClass = "bg-info";

      prayerList += `
        <li class="list-group-item d-flex justify-content-between align-items-center" ${isClickable}>
          ${name}
          <span class="badge ${badgeClass} text-light">${status}</span>
        </li>`;
    }

    historyCards += `
      <div class="col-md-6 col-lg-4" data-date="${date}">
        <div class="card shadow-sm">
          <div class="card-header fw-bold text-center">${date}</div>
          <ul class="list-group list-group-flush">${prayerList}</ul>
        </div>
      </div>`;
  }

  document.getElementById("namaz-history-cards").innerHTML = historyCards;

  let missingCards = missingDates.map(date => `
    <button class="btn btn-outline-danger m-1" onclick="createMissingDay('${date}')">${date}</button>
  `).join("");

  document.getElementById("missing-dates").innerHTML = missingCards || '<p>🎉 No missing dates!</p>';
};


window.markQaza = async (date, prayerName) => {
  const prayerRef = doc(db, "users", uid, "namazTracking", date);
  const docSnap = await getDoc(prayerRef);
  if (!docSnap.exists()) return;

  const data = docSnap.data();
  data.prayers[prayerName] = "Qaza Done";
  await setDoc(prayerRef, data);

  Swal.fire("Updated", `${prayerName} marked as Qaza Done`, "success");
  loadNamazData(document.getElementById("history-type").value); // refresh current filter
};


window.createMissingDay = async (date) => {
  const prayers = {
    Fajr: "Pending",
    Dhuhr: "Pending",
    Asr: "Pending",
    Maghrib: "Pending",
    Isha: "Pending"
  };
  await setDoc(doc(db, "users", uid, "namazTracking", date), { date, prayers });
  Swal.fire("Created", `Record for ${date} created`, "success");
  loadNamazData(document.getElementById("history-type").value); // refresh
};


onAuthStateChanged(auth, async (user) => {
  if (user) {
    userCreatedAt = new Date(user.metadata.creationTime);
    if (namazHistory) {
      namazHistory.addEventListener("click", renderHistoryPage);
    }
  }
});
