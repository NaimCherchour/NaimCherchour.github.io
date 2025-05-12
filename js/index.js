// Animate sections when they enter the viewport
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll('.nav-list a');
  let typewriterInitialized = false;

  function updateActiveNavLink(visibleSectionId) {
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${visibleSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";

                if (entry.intersectionRatio > 0.5) {
          const currentSectionId = entry.target.id;
          if (window.location.hash !== `#${currentSectionId}`) {
            // Use replaceState to avoid polluting history and prevent scroll jumps
            history.replaceState(null, null, `#${currentSectionId}`);
          }
          updateActiveNavLink(currentSectionId);
        }

        // If the intersecting section is the home section, start typewriter (only once)
        if (entry.target.id === 'home' && !typewriterInitialized) {
          const homeH1 = entry.target.querySelector('h1');
          if (homeH1) {
            const textToType = "Hello, I'm Naim Cherchour"; // Or get from homeH1.textContent if it's static
            typeWriter(homeH1, textToType, 100);
            typewriterInitialized = true; // Set flag to prevent re-running
          }
        }
      } else {
        // Optional: If you want animations to pause or reset when out of view
        // entry.target.style.animationPlayState = "paused";
      }
    });
  }, {
    threshold: [0.5, 0.6, 0.7] // Fire when 50%, 60%, 70% of the section is visible.
                               // This helps in accurately determining the "active" section.
                               // The 0.6 was your original for animation.
                               // Using multiple thresholds, especially around 0.5, is good for this.
  });

  sections.forEach(section => {
    section.style.animationPlayState = "paused"; // Keep animation paused initially
    observer.observe(section);
  });

  function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    // Add a cursor span
    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('typewriter-cursor');
    cursorSpan.textContent = '|';
    element.appendChild(cursorSpan);

    function type() {
      if (i < text.length) {
        element.insertBefore(document.createTextNode(text.charAt(i)), cursorSpan);
        i++;
        setTimeout(type, speed);
      } else {
        cursorSpan.style.animation = 'blink 1s step-end infinite';
        element.removeChild(cursorSpan);
      }
    }
    type();
  }

  // Set initial active link on page load
  function setInitialActiveState() {
    let currentHash = window.location.hash;
    if (currentHash) {
      updateActiveNavLink(currentHash.substring(1));
    } else if (sections.length > 0) {
      // If no hash, make the first section active by default
      updateActiveNavLink(sections[0].id);
      // Optionally set the hash for the first section
      // history.replaceState(null, null, `#${sections[0].id}`);
    }
  }
  setInitialActiveState();

  // Listen for hash changes (e.g., browser back/forward buttons)
  // and update active link accordingly.
  // Note: This might be redundant if the observer correctly handles all transitions,
  // but it's good for explicit hash changes.
  window.addEventListener('hashchange', setInitialActiveState, false);
});