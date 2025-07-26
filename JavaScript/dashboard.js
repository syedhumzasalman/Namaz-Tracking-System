import { db, doc, getDoc } from "../Firebase/firebase.js";




const authCheck = () => {
  const uid = localStorage.getItem("uid");
  if (!uid) {
    window.location.replace("./index.html")
  }

};

window.authCheck = authCheck;



// Sidebar Toggle
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.add("show");
  overlay.style.display = "block";
});

sidebarClose.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.style.display = "none";
});



// fetch user data
const fetchUserData = async () => {


  let userFirstName = document.getElementById("userFirstName");
  let userLastName = document.getElementById("userLastName");
  let userPic = document.getElementById("userPic");
  let userEmail = document.getElementById("userEmail");


  const userUid = localStorage.getItem("uid");
  const user = await getDoc(doc(db, "users", userUid));
  // console.log(user.data())

  userFirstName.innerText = user.data().firstName
  userLastName.innerText = user.data().lastName
  userEmail.innerText = user.data().email
  if (userPic) userPic.src = user.data().profileurl;
};

window.fetchUserData = fetchUserData;




//  Hadith in Dashboard

const sampleHadiths = [
  {
    hadithEnglish: "Actions are judged by intentions.",
    book: {
      bookName: "Sahih Bukhari"
    },
    englishNarrator: "Umar bin Al-Khattab"
  },
  {
    hadithEnglish: "The best among you are those who learn the Quran and teach it.",
    book: {
      bookName: "Sahih Bukhari"
    },
    englishNarrator: "Uthman bin Affan"
  },
  {
    hadithEnglish: "Make things easy and do not make them difficult, cheer the people up and do not drive them away.",
    book: {
      bookName: "Sahih Bukhari"
    },
    englishNarrator: "Aisha (RA)"
  },
  {
    hadithEnglish: "None of you truly believes until he loves for his brother what he loves for himself.",
    book: {
      bookName: "Sahih Muslim"
    },
    englishNarrator: "Anas bin Malik"
  }
];

const fetchHadiths = () => {
  const hadithContainer = document.getElementById("hadith-list");

  const randomIndex = Math.floor(Math.random() * sampleHadiths.length);
  const hadith = sampleHadiths[randomIndex];

  hadithContainer.innerHTML = `
    <p class="fs-5 font-italic">${hadith.hadithEnglish}</p>
    <footer class="blockquote-footer text-white-50 mt-3">
      <cite title="Source Title">${hadith.book.bookName}</cite>
      <cite title="Source Title">${hadith.englishNarrator}</cite>
    </footer>
  `;
};

document.addEventListener("DOMContentLoaded", () => {
  fetchHadiths();
});



// pie chart
document.addEventListener("DOMContentLoaded", async () => {
  const uid = localStorage.getItem("uid");
  if (!uid) return console.error("UID not found in localStorage");

  const ctx = document.getElementById("namazPieChart")?.getContext("2d");
  const beforeChart = document.getElementById("beforechart")
  if (!ctx) return console.error("Canvas not found!");



  try {
    const statsDoc = await getDoc(doc(db, "users", uid, "namazStats", "summary"));
    if (!statsDoc.exists()) {
      beforeChart.innerText = `Namaz History not found. Go to Namaz History page first`
      return console.warn("Summary not found. Go to history page first.");
    }

    const namazData = statsDoc.data();

    const orderedLabels = ["Completed", "Pending", "Qaza Done", "Missing"];
    const orderedData = orderedLabels.map(label => namazData[label] || 0);

    const chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: orderedLabels,
        datasets: [{
          data: orderedData,
          backgroundColor: [
            "#4caf50", // Completed
            "#ff9800", // Pending
            "#2196f3", // Qaza Done
            "#f44336"  // Missing
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw;
                const percent = total ? ((val / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${val} (${percent}%)`;
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
});
