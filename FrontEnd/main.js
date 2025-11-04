// page switch
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
    })

    document.getElementById(pageId + '-section').style.display = 'block';
}

window.onload = function() {
    showPage('home');
}


