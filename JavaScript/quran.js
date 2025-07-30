

let diaplayQuran = document.getElementById("diaplayQuran");
let mainContent = document.getElementById("mainContent");


let quranDisplay = () => {
    mainContent.innerHTML = "";

    Swal.fire({
        icon: 'info',
        title: 'Coming Soon ✨',
        html: `
            <p style="font-size:16px;">We're currently working on this feature to bring you an even better experience.</p>
            <p style="font-size:14px; color:#555;">Stay tuned, it will be available very soon!</p>
        `,
        confirmButtonText: 'Okay, I’ll wait!',
        confirmButtonColor: '#007BFF',
        background: '#ffffff',
        backdrop: `rgba(0,0,0,0.3)`,
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "dashboard.html"; 
        }
    });
}

diaplayQuran.addEventListener('click', quranDisplay)