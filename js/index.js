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
            history.replaceState(null, null, `#${currentSectionId}`);
          }
          updateActiveNavLink(currentSectionId);
        }

        if (entry.target.id === 'home' && !typewriterInitialized) {
          const homeH1 = entry.target.querySelector('h1');
          if (homeH1) {
            const textToType = "Hello, I'm Naim Cherchour";
            typeWriter(homeH1, textToType, 100);
            typewriterInitialized = true;
          }
        }
      } else {
        entry.target.style.animationPlayState = "paused";
      }
    });
  }, {
    threshold: [0.5, 0.6, 0.7]
  });

  sections.forEach(section => {
    section.style.animationPlayState = "paused";
    observer.observe(section);
  });

  function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
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
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });



  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;
  
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message })
    });
  
    const result = await response.json();
  
    if (response.ok) {
      alert("Message sent successfully!");
      contactForm.reset();
    } else {
      alert("Failed to send message: " + result.message);
    }
  });

  function setInitialActiveState() {
    let currentHash = window.location.hash;
    if (currentHash) {
      updateActiveNavLink(currentHash.substring(1));
    } else if (sections.length > 0) {
      updateActiveNavLink(sections[0].id);
      history.replaceState(null, null, `#${sections[0].id}`);
    }
  }
  setInitialActiveState();
  window.addEventListener('hashchange', setInitialActiveState, false);
});