/* =====================================
   Student Directory – Google Sheets CSV
===================================== */

/* 🔗 Google Sheets CSV URL */
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB65QUg74B_DfceBfa3_jfdmeoukzh7lZ20GTwTJxAfZVdkk-ik_A4RJcMrF7khg/pub?output=csv";

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
    <p><strong>${data.status}</strong></p>
    <p><strong>Id: </strong>${data.student_id}</p>
    <p><strong>Contact (Whatsapp): </strong>${data.whatsapp_contact}</p>
    <p><strong>Email: </strong> ${data.email}</p>
    <p><strong>Admission: </strong> ${data.admission_taken}</p>


    <button class="toggle-btn">View Details</button>

    <div class="extra-info">
      <p><strong>DoB:</strong> ${data.dob}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      <p><strong>Blood:</strong> ${data.blood}</p>
      <p><strong>Nationality: </strong> ${data.nationality}</p>
      <p><strong>Tribe Member: </strong> ${data.tribe_member}</p>
      <p><strong>Tribe Name: </strong> ${data.tribe_name}</p>
      <p><strong>NID: </strong> ${data.nid}</p>
      <p><strong>Father: </strong> ${data.father}</p>
      <p><strong>Mother: </strong> ${data.mother}</p>
      <p><strong>Home District: </strong> ${data.home_district}</p>
      <p><strong>Marital Status: </strong> ${data.marital_status}</p>
      <p><strong>Program: </strong> ${data.program}</p>
      <p><strong>Batch: </strong> ${data.batch}</p>
      <p><strong>Graduation Year: </strong> ${data.graduation_year}</p>
      <p><strong>HSC Passing Year: </strong> ${data.hsc_year}</p>
      <p><strong>HSC/Diploma/Alim/A-level institution: </strong> ${data.hsc_institution}</p>
      <p><strong>SSC Passing Year: </strong> ${data.ssc_year}</p>
      <p><strong>SSC/Dakhil/Equivalent institution: </strong> ${data.ssc_institution}</p>
      <p><strong>Present Address: </strong> ${data.present_address}</p>
      <p><strong>Permanent Address: </strong> ${data.permanent_address}</p>
      <p><strong>Job Experience 1: </strong> ${data.job_one}</p>
      <p><strong>Job Experience 1 Period: </strong> ${data.job_one_period}</p>
      <p><strong>Job Experience 2: </strong> ${data.job_two}</p>
      <p><strong>Job Experience 2 Period: </strong> ${data.job_two_period}</p>
      <p><strong>Job Experience 3: </strong> ${data.job_three}</p>
      <p><strong>Job Experience 3 Period: </strong> ${data.job_three_period}</p>
      <p><strong>How did you come to know about RTM-AKTU University: </strong> ${data.university_source}</p>
      <p><strong>Satisfaction: </strong> ${data.satisfaction}</p>
      <p><strong>Negative Experience: </strong> ${data.negative_experience}</p>
      <p><strong>Positive Experience: </strong> ${data.positive_experience}</p>
<p><strong>Write one thing that could be improved in this institution in your thought: </strong> ${data.improvement}</p>
  
  </div>
  `;

  const button = card.querySelector(".toggle-btn");
const details = card.querySelector(".extra-info");

button.onclick = () => {
  const isOpen = details.classList.toggle("show");
  button.textContent = isOpen ? "Hide Details" : "View Details";
};


  return card;
}

/* ---------------------------------- */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && next === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(current.trim());
      rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }

  if (current.length) {
    row.push(current.trim());
    rows.push(row);
  }

  const headers = rows.shift().map(h => h.toLowerCase());
  return rows.map(r => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] || "";
    });
    return obj;
  });
}
