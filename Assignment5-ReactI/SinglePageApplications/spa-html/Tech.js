class Tech {
  constructor(containerId) {
    const container = document.getElementById(containerId);
    const h2 = document.createElement('h2');
    h2.textContent = `NERP - It's a thing`;
    const ul = document.createElement('ul');
    for (const item of ['Node.js','Express','React','PostgreSQL']) {
      const li = document.createElement('li');
      li.textContent = item;
      ul.appendChild(li);
    }
    container.appendChild(h2);
    container.appendChild(ul);
  }
}