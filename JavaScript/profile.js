import { doc, getDoc, db } from "../Firebase/firebase.js";

let mainContent = document.getElementById("mainContent");
let profileBtn = document.querySelectorAll(".profileBtn");

const userUid = localStorage.getItem("uid");
const userDoc = await getDoc(doc(db, "users", userUid));
const userData = userDoc.data();


const profile = () => {
  mainContent.innerHTML = `
    <div class="container py-5">
      <div class="bg-white text-black rounded-4 p-4 mb-4 shadow">
        <div class="row align-items-center">
          <div class="col-md-2 text-center mb-3 mb-md-0">
            <img src="${userData?.profilePicture || ''}"
                class="rounded-circle border border-3 border-primary"
                style="width: 120px; height: 120px; object-fit: cover;" alt="Profile Picture">
          </div>
          <div class="col-md-10">
            <h2 class="mb-1">${userData.firstName || ''} ${userData.lastName || ''}</h2>
            <p class="mb-1"><i class="fas fa-envelope me-2"></i>${userData.email || 'No Email Available'}</p>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Personal Information -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
              <i class="fas fa-id-card me-2 text-primary"></i>Personal Information
            </div>
            <div class="card-body pt-0">
              <ul class="list-unstyled">
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Full Name:</span>
                  <span>${userData.firstName || ''} ${userData.lastName || ''}</span>
                </li>
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Date of Birth:</span>
                  <span>
                    ${userData.dateOfBirth
                    ? moment(userData.dateOfBirth.toDate()).format('MMMM Do YYYY')
                    : 'Not Provided'}
                  </span>
                </li>
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Gender:</span>
                  <span>${userData.gender || 'Not Provided'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 fw-bold fs-5 py-3">
              <i class="fas fa-address-book me-2 text-primary"></i>Contact Information
            </div>
            <div class="card-body pt-0">
              <ul class="list-unstyled">
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Email:</span>
                  <span>${userData.email || 'No Email'}</span>
                </li>
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Phone:</span>
                  <span>${userData.mobileNumber || 'Not Provided'}</span>
                </li>
                <li class="mb-3 d-flex">
                  <span class="me-2 fw-bold" style="width: 120px;">Address:</span>
                  <span>${userData.address || 'Not Provided'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

// button to display profile
profileBtn.forEach((btn) => {
  btn.addEventListener('click', profile);
});
