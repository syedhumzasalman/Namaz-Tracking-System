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

const profilePic = document.querySelector("#profilePic");

const fileHandler = async () => {
    const file = profilePic.files?.[0];

    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "namazTracker");

    try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dg4gdkblk/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
            return data.secure_url;
        } else {
            console.error("Cloudinary upload error:", data);
            return null;
        }
    } catch (error) {
        console.error("Upload error:", error.message);
        return null;
    }
};
window.fileHandler = fileHandler;




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

    const uploadedImageUrl = await fileHandler();


    try {


        Swal.fire({
            title: 'Please wait...',
            html: 'Creating your account...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });


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
            gender: gender.value,
            address: "",
            profileurl: uploadedImageUrl || "",
            uid: response.user.uid,
            creationTime: new Date().toISOString(),
        };

        const userRes = await setDoc(doc(db, "users", userUId), userObj);
        Swal.close();

        window.location.assign("/loginIn.html");
    } catch (error) {
        Swal.close();
        console.log("error", error.message);
        Swal.fire({
            icon: "error",
            title: "Signup Failed",
            text: error.message,
        });
    }
};

window.signupHandler = signupHandler;
window.authCheck = authCheck;
