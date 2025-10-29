// button functionality
document.getElementById('home-button').onclick = function() {
    document.getElementById('analytics-section').style.display = 'none';
};
document.getElementById('analytics-button').onclick = function() {
    document.getElementById('analytics-section').style.display = 'block';
};

// subtitle text typing animation
//const subtitle = document.getElementById('subtitle');
//const text = "Omicron Class Fall 2025";
let i = 0;
subtitle.textContent = "";
function typeWriter() {
    if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
    }
}
window.addEventListener('DOMContentLoaded', typeWriter);
