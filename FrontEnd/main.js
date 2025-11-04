// page switch
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
    })

    document.getElementById(pageId + '-section').style.display = 'block';

    if (pageId == 'analytics') {
        setTimeout(() => {
            // chart initialization
        })
    }
}

window.onload = function() {
    showPage('home');
}


