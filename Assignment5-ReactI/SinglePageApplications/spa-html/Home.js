class Home {
  constructor(containerId) {
    const container = document.getElementById(containerId);
    const h2 = document.createElement('h2');
    h2.textContent = 'Welcome';
    const p = document.createElement('p');
    p.textContent = 'Wise, you are, in taking this class.';
    container.appendChild(h2);
    container.appendChild(p);
  }
}