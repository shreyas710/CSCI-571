window.addEventListener("click", (e) => {
    const inputElement = document.getElementById("search-container")
    if (inputElement.contains(e.target)) {
        inputElement.classList.add('search-container-active');
    } else {
        inputElement.classList.remove('search-container-active');
    }
})


