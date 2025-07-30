import { auth, signInWithEmailAndPassword } from "../Firebase/firebase.js";

const authCheck = () => {
    const uid = localStorage.getItem("uid");
    if (uid) {
        window.location.replace("./dashboard.html")
    }

};

const loginHandler = async () => {

    const email = document.querySelector("#email");
    const password = document.querySelector("#password");


    // Validation
    if (!email.value || !password.value) {
        Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "All fields are required!",
        });
        return;
    }

    //  check if Email include @gamil.com or not
    if (!/^[^\s@]+@gmail\.com$/.test(email.value)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid Gmail address (e.g., user@gmail.com)!",
        });
        return;
    }


    try {

        if (!email.value || !password.value) {
            alert("Required Field are missing");
            return;
        }
        const response = await signInWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );

        localStorage.setItem("uid", response.user.uid);
        window.location.replace("../dashboard.html");
    } catch (error) {
        console.log(error.message);
        Swal.fire({
            icon: "error",
            title: error.message,
        });
    }
};

window.loginHandler = loginHandler;
window.authCheck = authCheck;
