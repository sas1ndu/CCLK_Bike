/* ===========================================================
   WheelDeal.lk — vanilla JS, no dependencies.

   - Product data is inlined (no fetch round-trip on GitHub Pages).
   - Listing photos are generated on the fly as inline SVG data
     URIs — zero network requests, so they always render, even in
     a sandboxed preview with no internet access. Swap in real
     photos any time by setting a product's `image` field to a URL
     or local path (see README) — real images always take priority
     over the generated placeholder.
   - Video is a real YouTube embed, but the <iframe> is only built
     when someone taps "Watch video", so nobody pays the cost of
     loading YouTube's player just to browse listings. A plain-link
     fallback is included in case an embed is ever blocked.
   - All enquiries route to one WhatsApp/call number, with an
     auto-filled message that names the exact bike + a reference
     code, so your team always knows which listing an enquiry is for.
   =========================================================== */

/* ---- Contact routing — change these two values to your real numbers ---- */
const CONTACT = {
  callDisplay: "070 518 7952",   // shown to the user
  callHref: "0705187952",        // tel: link, local format
  whatsapp: "94705187952"        // wa.me link, international format, no + or spaces
};

const PRODUCTS = [
  {
    id: "dio-2021", title: "Honda Dio 2021", category: "scooter",
    price: 385000, year: 2021, km: 8400, engine: "110cc", condition: "Excellent",
    location: "Colombo", seller: "Nimal M.",
    desc: "Single owner, full service history at Honda Kandy. Never had an accident, comes with two keys and the original toolkit.",
    image: null, video: "dQw4w9WgXcQ"
  },
  {
    id: "pulsar-150-2019", title: "Bajaj Pulsar 150", category: "sport",
    price: 425000, year: 2019, km: 21500, engine: "150cc", condition: "Good",
    location: "Kandy", seller: "Sajith P.",
    desc: "Well maintained Pulsar with new tyres fitted last month. Minor scratch on the tank, otherwise runs like new.",
    image: null, video: "dQw4w9WgXcQ"
  },
  {
    id: "ct100-2017", title: "Bajaj CT100", category: "commuter",
    price: 195000, year: 2017, km: 34200, engine: "100cc", condition: "Fair",
    location: "Kurunegala", seller: "Ruwan D.",
    desc: "Reliable daily commuter, great fuel economy. Selling because I've upgraded to a scooter.",
    image: null, video: null
  },
  {
    id: "fz-v3-2020", title: "Yamaha FZ V3", category: "sport",
    price: 495000, year: 2020, km: 15800, engine: "149cc", condition: "Excellent",
    location: "Negombo", seller: "Chamara K.",
    desc: "Showroom condition. LED headlamp, digital meter, all original parts. Test rides welcome in Negombo.",
    image: null, video: "dQw4w9WgXcQ"
  },
  {
    id: "ntorq-2022", title: "TVS NTorq 125", category: "scooter",
    price: 340000, year: 2022, km: 5200, engine: "125cc", condition: "Excellent",
    location: "Galle", seller: "Ishara W.",
    desc: "Almost new, bought last year. Bluetooth speedometer works perfectly. Selling due to relocation abroad.",
    image: null, video: null
  },
  {
    id: "gixxer-2018", title: "Suzuki Gixxer", category: "sport",
    price: 455000, year: 2018, km: 26400, engine: "155cc", condition: "Good",
    location: "Jaffna", seller: "Kavin T.",
    desc: "Sporty look, strong engine. Recently serviced with new brake pads and chain set.",
    image: null, video: "dQw4w9WgXcQ"
  },
  {
    id: "hunk-2016", title: "Hero Hunk", category: "commuter",
    price: 240000, year: 2016, km: 41000, engine: "150cc", condition: "Fair",
    location: "Matara", seller: "Dinesh S.",
    desc: "Sturdy and dependable, ideal for a first bike. A few cosmetic marks but mechanically solid.",
    image: null, video: null
  },
  {
    id: "avenger-2015", title: "Bajaj Avenger 220", category: "cruiser",
    price: 365000, year: 2015, km: 38700, engine: "220cc", condition: "Good",
    location: "Anuradhapura", seller: "Priyantha G.",
    desc: "Comfortable cruiser seating, great for long rides. Recent full service and new battery.",
    image: null, video: "dQw4w9WgXcQ"
  }
];

const fmtPrice = n => "Rs " + n.toLocaleString("en-LK");
const fmtKm = n => n.toLocaleString("en-LK") + " km";
const refCode = p => "REF-" + p.id.toUpperCase();

/* ---- Self-contained SVG placeholder (no network needed) ---- */
const CATEGORY_THEME = {
  scooter:  { bg: "#0E7C7B", bg2: "#0B6362" },
  commuter: { bg: "#4B4F55", bg2: "#34373C" },
  sport:    { bg: "#FF7A1A", bg2: "#D9600A" },
  cruiser:  { bg: "#14171A", bg2: "#2B2F33" }
};

function placeholderImage(p){
  const theme = CATEGORY_THEME[p.category] || CATEGORY_THEME.commuter;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.bg}"/>
      <stop offset="1" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="480" fill="url(#g)"/>
  <g opacity="0.16" fill="#fff">
    <circle cx="180" cy="330" r="70"/>
    <circle cx="460" cy="330" r="70"/>
    <rect x="150" y="200" width="340" height="18" rx="9"/>
  </g>
  <text x="320" y="230" font-family="-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="64" text-anchor="middle">🏍️</text>
  <text x="320" y="410" font-family="-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="30" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(p.title)}</text>
  <text x="320" y="440" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="18" fill="#ffffffb3" text-anchor="middle">${p.year} · ${p.engine}</text>
</svg>`.trim();
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}
function escapeXml(s){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function imgSrc(p){ return p.image || placeholderImage(p); }

/* ---- WhatsApp / call links with a trackable reference ---- */
function listingUrl(p){
  return `${location.origin}${location.pathname}#/${p.id}`;
}
function whatsappUrl(p){
  const msg = `Hi WheelDeal.lk, I'm interested in the ${p.title} (${refCode(p)}). ` +
              `Price shown: ${fmtPrice(p.price)}. Listing: ${listingUrl(p)}`;
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`;
}
function callUrl(){ return `tel:${CONTACT.callHref}`; }

const grid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const listView = document.getElementById("listView");
const detailView = document.getElementById("detailView");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const chipRow = document.getElementById("chipRow");

let state = { query: "", category: "all", sort: "new" };

function filteredProducts(){
  let list = PRODUCTS.filter(p => {
    const matchesCat = state.category === "all" || p.category === state.category;
    const q = state.query.trim().toLowerCase();
    const matchesQuery = !q || (p.title + " " + p.location).toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });
  switch(state.sort){
    case "lowprice": list.sort((a,b) => a.price - b.price); break;
    case "highprice": list.sort((a,b) => b.price - a.price); break;
    case "lowkm": list.sort((a,b) => a.km - b.km); break;
    default: list.sort((a,b) => b.year - a.year);
  }
  return list;
}

function cardTemplate(p){
  return `
    <article class="card" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.title}">
      <div class="card-media">
        <img src="${imgSrc(p)}" alt="${p.title}" loading="lazy" decoding="async" width="640" height="480">
        <span class="condition-badge">${p.condition}</span>
        ${p.video ? `<span class="video-badge">▶ Video</span>` : ""}
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-meta"><span>${p.year}</span><span>${p.engine}</span><span>${p.location}</span></div>
        <div class="odometer">
          <span class="price-chip">${fmtPrice(p.price)}</span>
          <span class="km-readout">${fmtKm(p.km)}</span>
        </div>
        <div class="card-actions">
          <a class="mini-btn call" href="${callUrl()}" aria-label="Call about ${p.title}" data-stop>📞 Call</a>
          <a class="mini-btn whatsapp" href="${whatsappUrl(p)}" target="_blank" rel="noopener" aria-label="WhatsApp about ${p.title}" data-stop>💬 WhatsApp</a>
        </div>
      </div>
    </article>`;
}

function renderGrid(){
  const list = filteredProducts();
  resultCount.textContent = `${list.length} bike${list.length === 1 ? "" : "s"} found`;
  emptyState.hidden = list.length !== 0;
  grid.innerHTML = list.map(cardTemplate).join("");
}

function renderDetail(p){
  detailView.innerHTML = `
    <button class="back-btn" id="backBtn">&larr; Back to listings</button>
    <div class="detail-media">
      <img src="${imgSrc(p)}" alt="${p.title}" width="800" height="600">
    </div>
    <div class="detail-body">
      <div class="ref-tag">${refCode(p)}</div>
      <h1 class="detail-title">${p.title}</h1>
      <div class="detail-meta">${p.year} · ${p.engine} · ${fmtKm(p.km)} · ${p.location}</div>

      <div class="detail-price-row">
        <span class="detail-price">${fmtPrice(p.price)}</span>
        ${p.video ? `<button class="watch-btn" id="watchBtn" data-video="${p.video}">▶ Watch video</button>` : ""}
      </div>

      <table class="spec-table">
        <tr><td>Year</td><td>${p.year}</td></tr>
        <tr><td>Mileage</td><td>${fmtKm(p.km)}</td></tr>
        <tr><td>Engine</td><td>${p.engine}</td></tr>
        <tr><td>Condition</td><td>${p.condition}</td></tr>
        <tr><td>Location</td><td>${p.location}</td></tr>
      </table>

      <p class="detail-desc">${p.desc}</p>

      <div class="seller-card">
        <div class="seller-avatar">${p.seller.charAt(0)}</div>
        <div class="seller-info">
          <strong>${p.seller}</strong>
          <span>Posted from ${p.location}</span>
        </div>
      </div>

      <div class="contact-row">
        <a class="contact-btn call" href="${callUrl()}">📞 Call ${CONTACT.callDisplay}</a>
        <a class="contact-btn whatsapp" href="${whatsappUrl(p)}" target="_blank" rel="noopener">💬 WhatsApp about this bike</a>
      </div>
    </div>`;

  document.getElementById("backBtn").addEventListener("click", () => { location.hash = "#/"; });
  const watchBtn = document.getElementById("watchBtn");
  if(watchBtn){
    watchBtn.addEventListener("click", () => openVideo(watchBtn.dataset.video));
  }
}

/* -------------------- Video modal -------------------- */
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");

function openVideo(youtubeId){
  // iframe is only created here, on demand, plus a plain-link fallback
  // in case an embed is ever blocked (e.g. restrictive network/CSP).
  videoFrame.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0"
      title="Bike video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
    <a class="video-fallback" href="https://youtu.be/${youtubeId}" target="_blank" rel="noopener">
      Video not showing? Open on YouTube ↗
    </a>`;
  videoModal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeVideo(){
  videoModal.hidden = true;
  videoFrame.innerHTML = ""; // stop playback & free memory
  document.body.style.overflow = "";
}
videoModal.addEventListener("click", e => {
  if(e.target.hasAttribute("data-close")) closeVideo();
});
document.addEventListener("keydown", e => { if(e.key === "Escape") closeVideo(); });

/* -------------------- Routing -------------------- */
function route(){
  const hash = location.hash.replace(/^#\//, "");
  if(hash){
    const p = PRODUCTS.find(x => x.id === hash);
    if(p){
      listView.hidden = true;
      detailView.hidden = false;
      renderDetail(p);
      window.scrollTo(0,0);
      return;
    }
  }
  listView.hidden = false;
  detailView.hidden = true;
}
window.addEventListener("hashchange", route);

/* -------------------- Event wiring -------------------- */
grid.addEventListener("click", e => {
  if(e.target.closest("[data-stop]")) return; // let Call/WhatsApp links work without opening the detail page
  const card = e.target.closest(".card");
  if(card) location.hash = "#/" + card.dataset.id;
});
grid.addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " "){
    const card = e.target.closest(".card");
    if(card){ e.preventDefault(); location.hash = "#/" + card.dataset.id; }
  }
});

searchInput.addEventListener("input", e => { state.query = e.target.value; renderGrid(); });
sortSelect.addEventListener("change", e => { state.sort = e.target.value; renderGrid(); });

chipRow.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if(!chip) return;
  chipRow.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  chip.classList.add("is-active");
  state.category = chip.dataset.cat;
  renderGrid();
});

const searchToggle = document.getElementById("searchToggle");
const searchRow = document.getElementById("searchRow");
searchToggle.addEventListener("click", () => {
  const open = searchRow.classList.toggle("is-open");
  searchToggle.setAttribute("aria-expanded", String(open));
  if(open) searchInput.focus();
});

/* -------------------- Init -------------------- */
renderGrid();
route();
