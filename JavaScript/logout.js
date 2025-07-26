import { auth, signOut } from "../Firebase/firebase.js";


const logOutBtn = document.getElementById("logout-btn");

// Function to handle sign out
const handleSignOut = () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("namazRatio");

            window.location.replace("../index.html");
        })
        .catch((error) => {
            console.error("Sign out error:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while signing out!",
            });
        });
};


if (logOutBtn) {
    logOutBtn.addEventListener("click", handleSignOut);
}
