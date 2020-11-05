class Help {
  constructor(containerId) {
    const container = document.getElementById(containerId);
    const h2 = document.createElement('h2');
    h2.textContent = 'Got Questions?';
    const p = document.createElement('p');
    p.textContent = 'Easiest thing to do is mail me a letter.';
    container.appendChild(h2);
    container.appendChild(p);
  }
}