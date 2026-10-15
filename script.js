const generateForm = document.querySelector(".generate_form");
const imageGallery = document.querySelector(".img_gallery");

const UNSPLASH_ACCESS_KEY = "mtHHBSzDgs-Pmw3Z2Ae-ohKIDK_1Iks9j2tfwKD-uWw"; // Replace with your Unsplash API key

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach(imgObject => {
        const imgCard = document.createElement("div");
        imgCard.className = "img_card";
        imgCard.innerHTML = `
            <img src="${imgObject.urls.regular}" alt="Generated image">
            <a href="${imgObject.urls.full}" class="download_btn" download="${imgObject.id}.jpg">
                <img src="images/download.svg" alt="Download icon">
            </a>
        `;
        imageGallery.appendChild(imgCard);
    });
};

const fetchUnsplashImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(userPrompt)}&per_page=${userImgQuantity}`, {
            method: "GET",
            headers: {
                "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
        });

        if (!response.ok) {
            const errorDetail = await response.json();
            throw new Error(`Error: ${response.status} ${response.statusText} - ${errorDetail.errors.join(', ')}`);
        }

        const { results } = await response.json();
        updateImageCard(results);
    } catch (error) {
        console.error('Error fetching images:', error);
        alert(`Failed to fetch images: ${error.message}`);
    }
};

generateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userPrompt = e.target.querySelector(".prompt_input").value.trim();
    const userImgQuantity = parseInt(e.target.querySelector(".img_quantity").value);

    if (!userPrompt) {
        alert("Please enter a prompt.");
        return;
    }
    if (isNaN(userImgQuantity) || userImgQuantity <= 0) {
        alert("Please enter a valid number of images.");
        return;
    }

    imageGallery.innerHTML = ""; // Clear the gallery before new images are loaded
    await fetchUnsplashImages(userPrompt, userImgQuantity);
});
