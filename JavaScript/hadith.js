let handelHadith = document.getElementById("handelHadith");
let mainContent = document.getElementById("mainContent");

const fetchHadiths = async () => {
    mainContent.innerHTML = ``;

    try {
        const response = await fetch("https://hadithapi.com/api/hadiths?apiKey=$2y$10$gI4BFKy4ktVHSuOX2XE2LOgLe54LUnCKbjDeexYawunQB58ZdXnS");
        const data = await response.json();

        if (!data?.hadiths?.data?.length) {
            mainContent.innerHTML = `<p class="text-danger">No hadiths found.</p>`;
            return;
        }

        const hadithsArray = data.hadiths.data;
        const randomIndex = Math.floor(Math.random() * hadithsArray.length);
        const hadith = hadithsArray[randomIndex];

        mainContent.innerHTML = `
            <div class="container mt-5">
                <div class="card border-0 shadow-lg h-100"
                    style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);">
                    <div class="card-body text-white p-4 d-flex flex-column justify-content-between h-100">
                        <div>
                            <div class="d-flex align-items-center mb-3">
                                <i class="fas fa-quote-left fa-2x opacity-50 me-3"></i>
                                <h4 class="mb-0">Hadith</h4>
                            </div>
                            <blockquote class="blockquote mb-0">
                                <p class="fs-5 font-italic">${hadith.hadithEnglish}</p>
                                <footer class="blockquote-footer text-white-50 mt-3">
                                    <cite title="Book">${hadith.book?.bookName || 'Unknown Book'}</cite>,
                                    <cite title="Narrator">${hadith.englishNarrator || 'Unknown Narrator'}</cite>
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error fetching Hadith:", error);
        mainContent.innerHTML = `<p class="text-danger">Failed to load Hadith. Please try again later.</p>`;
    }
};

handelHadith.addEventListener("click", fetchHadiths);
