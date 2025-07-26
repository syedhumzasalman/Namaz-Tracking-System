import { doc, getDoc, db, updateDoc } from "../Firebase/firebase.js";

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
            <img src="${userData?.profileurl || ''}"
                class="rounded-circle border border-3 border-primary"
                style="width: 120px; height: 120px; object-fit: cover;" alt="Profile Picture">
          </div>
          <div class="col-md-10">
            <h2 class="mb-1 ms-3">${userData.firstName || ''} ${userData.lastName || ''}</h2>
            <p class="mb-1 ms-3"><i class="fas fa-envelope me-2"></i>${userData.email || 'No Email Available'}</p>
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
      ? moment(userData.dateOfBirth).format('MMMM Do YYYY')
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
    <div class="text-center mt-2">
    <button class="btn btn-primary px-4" onclick="openUpdateProfileForm()">
      <i class="fas fa-edit me-2"></i>Update Profile
    </button>
  </div>
  `;
};

// button to display profile
profileBtn.forEach((btn) => {
  btn.addEventListener('click', profile);
});



window.openUpdateProfileForm = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Update Profile',
    html: `
      <input id="swal-firstName" class="swal2-input" placeholder="First Name" value="${userData.firstName || ''}">
      <input id="swal-lastName" class="swal2-input" placeholder="Last Name" value="${userData.lastName || ''}">
      <input id="swal-email" class="swal2-input" placeholder="Email" value="${userData.email || ''}" readonly>
      <input id="swal-mobile" class="swal2-input" placeholder="Mobile Number" value="${userData.mobileNumber || ''}">
      <input id="swal-address" class="swal2-input" placeholder="Address" value="${userData.address || ''}">
      <input id="swal-dob" class="swal2-input" type="date" placeholder="Date of Birth" value="${userData.dateOfBirth || ''}">
      <select id="swal-gender" class="swal2-input">
        <option value="">Select Gender</option>
        <option value="Male" ${userData.gender === "Male" ? "selected" : ""}>Male</option>
        <option value="Female" ${userData.gender === "Female" ? "selected" : ""}>Female</option>
      </select>
    `,
    focusConfirm: false,
    preConfirm: () => {
      return {
        firstName: document.getElementById('swal-firstName').value.trim(),
        lastName: document.getElementById('swal-lastName').value.trim(),
        email: document.getElementById('swal-email').value.trim(),
        mobileNumber: document.getElementById('swal-mobile').value.trim(),
        address: document.getElementById('swal-address').value.trim(),
        dateOfBirth: document.getElementById('swal-dob').value,
        gender: document.getElementById('swal-gender').value
      };
    },
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel'
  });

  if (formValues) {
    handleUpdateProfile(formValues);
  }
};


async function handleUpdateProfile(updatedData) {
  try {
    const uid = localStorage.getItem("uid");

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updatedData);

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile information has been successfully updated!",
    });

    const newDoc = await getDoc(userRef);
    Object.assign(userData, newDoc.data());

    profile();

  } catch (error) {
    console.error("Error updating profile:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error.message || "Something went wrong!",
    });
  }
}