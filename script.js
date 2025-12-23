/* =====================================
   Student Directory – Google Sheets CSV
===================================== */

/* 🔗 Google Sheets CSV URL */
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSi_4flCV8bZyjqYireFQwrsRLRoJaa5sR0CxkJ4Nw3_9nD6HA41k-D4BnwLk0y1g/pub?output=csv";

const DEFAULT_IMAGE = "assets/default.jpg";
const container = document.getElementById("cardContainer");

/* ---------------------------------- */
fetch(`${SHEET_CSV_URL}&v=${Date.now()}`, { cache: "no-store" })
  .then(res => {
    if (!res.ok) throw new Error("Failed to load sheet");
    return res.text();
  })
  .then(renderCards)
  .catch(err => {
    console.error(err);
    container.innerHTML = "<p>Unable to load data</p>";
  });

/* ---------------------------------- */
function renderCards(csvText) {
  const students = parseCSV(csvText);
  container.innerHTML = "";
  students.forEach(s => container.appendChild(createCard(s)));
}

/* ---------------------------------- */
function createCard(data) {
  const card = document.createElement("div");
  card.className = "card";

  const imageSrc = data.image
    ? `https://drive.google.com/thumbnail?id=${data.image}&sz=w1000`
    : DEFAULT_IMAGE;

  card.innerHTML = `
    <img src="${imageSrc}"
         alt="${data.student_name}"
         onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'">

    <h3>${data.student_name}</h3>
    <p><strong>Id: </strong>${data.student_id}</p>
    <p><strong>Contact (Whatsapp): </strong>${data.whatsapp_contact}</p>
    <p><strong>Email: </strong> ${data.email}</p>


    <button class="toggle-btn">View Details</button>

    <div class="extra-info">
      <p><strong>DoB:</strong> ${data.dob}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      <p><strong>Blood:</strong> ${data.blood}</p>
      <p><strong>NID: </strong>Private ${data.not_given}</p>
      <p><strong>Father's Name: </strong> ${data.father}</p>
      <p><strong>Mother's: </strong> ${data.mother}</p>
      <p><strong>Home District: </strong> ${data.home_district}</p>
      <p><strong>Marital Status: </strong> ${data.marital_status}</p>
      <p><strong>Admission: </strong> ${data.admission_taken}</p>
      <p><strong>Graduation Year: </strong> ${data.graduation_year}</p>
      <p><strong>HSC institution: </strong> ${data.hsc_institution}</p>
      <p><strong>Present Address: </strong> ${data.present_address}</p>
      <p><strong>Permanent Address: </strong> ${data.permanent_address}</p>
      <p><strong>Job Experience 1: </strong> ${data.job_experience_1}</p>
      <p><strong>Job Experience 2: </strong> ${data.job_experience_2}</p>
      <p><strong>Job Experience 3: </strong> ${data.job_experience_3}</p>
      <p><strong>Satisfaction: </strong> ${data.satisfaction}</p>
      <p><strong>Negative Experience: </strong> ${data.negative_experience}</p>
      <p><strong>Positive Experience: </strong> ${data.positive_experience}</p>


    </div>
  `;

  card.querySelector(".toggle-btn").onclick = () =>
    card.querySelector(".extra-info").classList.toggle("show");

  return card;
}

/* ---------------------------------- */
function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines.shift().split(",").map(h => h.trim().toLowerCase());

  return lines.map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}
