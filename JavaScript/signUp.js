import {
    auth,
    createUserWithEmailAndPassword,
    db,
    doc,
    setDoc,
} from "../Firebase/firebase.js";


const authCheck = () => {
    const uid = localStorage.getItem("uid");
    if (uid) {
        window.location.replace("../dashboard.html")
    }

};


const signupHandler = async () => {

    const firstName = document.querySelector("#firstName");
    const lastName = document.querySelector("#lastName");
    const mobileNumber = document.querySelector("#mobileNumber");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const dateOfBirth = document.querySelector("#dateOfBirth");
    const gender = document.querySelector("#gender");


    // Validation
    if (!firstName.value || !lastName.value || !mobileNumber.value || !email.value || !password.value || !dateOfBirth.value || !gender.value) {
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

        // sign up user through firebase auth
        const response = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );
        const userUId = response.user.uid;

        // store user data in firestore
        const userObj = {
            firstName: firstName.value,
            lastName: lastName.value,
            mobileNumber: mobileNumber.value,
            email: email.value,
            dateOfBirth: dateOfBirth.value,
            gender: gender,value,
            uid: response.user.uid,
        };

        const userRes = await setDoc(doc(db, "users", userUId), userObj);

        window.location.assign("/loginIn.html");
    } catch (error) {
        console.log("error", error.message);
        Swal.fire({
            icon: "error",
            title: error.message,
        });
    }
};

window.signupHandler = signupHandler;
window.authCheck = authCheck;
