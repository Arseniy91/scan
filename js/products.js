const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  menu.classList.toggle('open');
  overlay.classList.toggle('show');
});

overlay.addEventListener('click', () => {
  burger.classList.remove('active');
  menu.classList.remove('open');
  overlay.classList.remove('show');
});

  const scanned = JSON.parse(localStorage.getItem("scannedProducts")) || [];
  const list = document.getElementById("productList");

  if (scanned.length === 0) {
    list.innerHTML = "<li>Нет сохранённых продуктов</li>";
  } else {
    scanned.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} — срок годности: ${p.expiryDate}`;
      list.appendChild(li);
    });
  }


