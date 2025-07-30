

const authCheck = () => {
    const uid = localStorage.getItem("uid");
    if (uid) {
        window.location.replace("../dashboard.html")
    }

};

window.authCheck = authCheck;
