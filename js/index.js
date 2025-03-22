// Minimal JavaScript that you can extend as needed

document.addEventListener('DOMContentLoaded', () => {
  console.log("Website loaded with fresh HTML/CSS/JS");
  
  // Example: Smooth scrolling for nav links
  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});