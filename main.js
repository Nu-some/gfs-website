// main.js — custom logic for the redesigned home page

document.addEventListener('DOMContentLoaded', () => {
  // Animate the "What we do" section when it comes into view
  const contentEl = document.querySelector('.what-we-do .content');
  if (contentEl) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(contentEl);
  }

  // Load a random fact for the "Did you know" section
  fetch('facts.json')
    .then(response => response.json())
    .then(facts => {
      if (!facts || !Array.isArray(facts) || facts.length === 0) {
        return;
      }
      const displayFact = () => {
        const index = Math.floor(Math.random() * facts.length);
        let fact = facts[index];
        // If the fact is an object with a fact property, extract it
        if (typeof fact === 'object' && fact !== null && 'fact' in fact) {
          fact = fact.fact;
        }
        const factEl = document.querySelector('.fact-text');
        if (factEl) {
          factEl.textContent = fact;
        }
      };
      // Display an initial fact
      displayFact();
      // Optionally cycle facts every 15 seconds
      setInterval(displayFact, 15000);
    })
    .catch(err => {
      console.error('Failed to load facts.json', err);
    });
});