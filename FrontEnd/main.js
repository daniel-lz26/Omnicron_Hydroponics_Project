// typing anim.
function typeText(element, text, speed = 75) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// page switch
function scrollToSection(sectionId) {
    document.getElementById(sectionId + '-section').scrollIntoView({
        behavior: 'smooth'
    });
    // anim plays when home is shown
    if (sectionId === 'home') {
        const typingElement = document.getElementById('typing-text');
        if (typingElement) {
            setTimeout(() => {
                typeText(typingElement, "Grow with us.", 75);
            }, 500);
        }
    }
}

window.onload = function() {
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        setTimeout(() => {
            typeText(typingElement, "Grow with us.", 75);
        }, 1000)
    }
}