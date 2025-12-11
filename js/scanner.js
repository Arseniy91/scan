document.getElementById("startBtn").addEventListener("click", () => {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector("#scanner-container"),
      constraints: {
        facingMode: "environment",
        width: 640,
        height: 480
      }
    },
    decoder: {
      readers: ["ean_reader", "upc_reader", "code_128_reader"]
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    numOfWorkers: 0,
    frequency: 10
  }, err => {
    if (err) {
      console.error(err);
      alert("Ошибка запуска камеры");
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const barcode = data.codeResult.code;
    console.log("Штрих-код:", barcode);

    // обращаемся к FastAPI, а не к products.json
    fetch(`http://localhost:8000/product/${encodeURIComponent(barcode)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Ошибка ответа сервера");
        }
        return res.json();
      })
      .then(data => {
        console.log("Ответ сервера:", data);

        if (!data.found) {
          alert("❌ Продукт не найден");
          return;
        }

        let message = `🧾 ${data.name}\n`;
        message += data.expired ? "⚠️ Просрочен\n" : "✅ Срок годности в норме\n";
        message += data.allergens && data.allergens.length > 0
          ? `🚫 Аллергены: ${data.allergens.join(", ")}\n`
          : "🌿 Безопасен для аллергиков\n";
        message += data.diabetic
          ? "🚫 Не рекомендуется диабетикам"
          : "✅ Можно диабетикам";

        alert(message);

        // локальная история в браузере, если хочешь сохранять
        let scanned = JSON.parse(localStorage.getItem("scannedProducts")) || [];
        scanned.push({
          barcode,
          name: data.name,
          expired: data.expired,
          allergens: data.allergens,
          diabetic: data.diabetic
        });
        localStorage.setItem("scannedProducts", JSON.stringify(scanned));
      })
      .catch(err => {
        console.error("Ошибка:", err);
        alert("Ошибка связи с сервером");
      });

    // можно убрать, если хочешь сканировать несколько подряд
    Quagga.stop();
  });
});

// бургер как был
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
