/* =====================================
   Student Directory – Final Clean Script
===================================== */

const CSV_PATH = "data/students.csv";
const IMAGE_FOLDER = "assets";
const DEFAULT_IMAGE = "6.png";

const container = document.getElementById("cardContainer");

/* -------------------------------------
   Fetch CSV (no cache)
-------------------------------------- */
fetch(`${CSV_PATH}?v=${Date.now()}`, { cache: "no-store" })
  .then(res => {
    if (!res.ok) throw new Error("CSV load failed");
    return res.text();
  })
  .then(renderCards)
  .catch(() => {
    container.innerHTML = "<p>Unable to load student data.</p>";
  });

/* -------------------------------------
   Render all cards
-------------------------------------- */
function renderCards(csvText) {
  const students = parseCSV(csvText);
  container.innerHTML = "";

  students.forEach(student => {
    container.appendChild(createCard(student));
  });
}

/* -------------------------------------
   Create student card
-------------------------------------- */
function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";

  const imageSrc = getImageSrc(data);

  card.innerHTML = `
    <img src="${imageSrc}"
         alt="${data.name}"
         onerror="this.onerror=null;this.src='${IMAGE_FOLDER}/${DEFAULT_IMAGE}'">

    <h3>${data.name}</h3>
    <p><strong>Title: </strong>${data.title}</p>
    <p>${data.department}</p>

    <button class="toggle-btn">View Details</button>

    <div class="extra-info">
      <p><strong>Office:</strong> ${data.office}</p>
      <p><strong>Mobile:</strong> ${data.mobile}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>About:</strong> ${data.about}</p>

      <div class="social">
        ${data.linkedin ? `<a href="${data.linkedin}" target="_blank">LinkedIn</a>` : ""}
        ${data.twitter ? `<a href="${data.twitter}" target="_blank">Twitter</a>` : ""}
      </div>
    </div>
  `;

  setupToggle(card);
  return card;
}

/* -------------------------------------
   Toggle details
-------------------------------------- */
function setupToggle(card) {
  const btn = card.querySelector(".toggle-btn");
  const details = card.querySelector(".extra-info");

  btn.addEventListener("click", () => {
    const open = details.classList.toggle("show");
    btn.textContent = open ? "Hide Details" : "View Details";
  });
}

/* -------------------------------------
   Image source resolver
-------------------------------------- */
function getImageSrc(data) {
  /* If CSV has image column, use it */
  if (data.image) {
    return `${IMAGE_FOLDER}/${data.image.trim()}`;
  }

  /* Otherwise derive from name */
  const fileName = data.name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  return `${IMAGE_FOLDER}/${fileName}.jpg`;
}

/* -------------------------------------
   CSV Parser (simple & safe)
-------------------------------------- */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines.shift().split(",").map(h => h.trim().toLowerCase());

  return lines.map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};

    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });

    return obj;
  });
}
