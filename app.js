/* ===========================================================
   WheelDeal.lk — vanilla JS, no dependencies.
   - Product data is inlined (no fetch round-trip on GitHub Pages).
   - Images use Unsplash's resize API at a small width/quality so
     even low-end mobile connections load fast. Swap for your own
     photos any time — just change the `image` field below.
   - Video is a real YouTube embed, but the <iframe> is only built
     when someone taps "Watch video", so nobody pays the cost of
     loading YouTube's player just to browse listings.
   =========================================================== */

const PRODUCTS = [
  {
    id: "dio-2021",
    title: "Honda Dio 2021",
    category: "scooter",
    price: 385000,
    year: 2021,
    km: 8400,
    engine: "110cc",
    condition: "Excellent",
    location: "Colombo",
    seller: "Nimal M.",
    phone: "077 123 4567",
    desc: "Single owner, full service history at Honda Kandy. Never had an accident, comes with two keys and the original toolkit.",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=640&q=60",
    video: "dQw4w9WgXcQ"
  },
  {
    id: "pulsar-150-2019",
    title: "Bajaj Pulsar 150",
    category: "sport",
    price: 425000,
    year: 2019,
    km: 21500,
    engine: "150cc",
    condition: "Good",
    location: "Kandy",
    seller: "Sajith P.",
    phone: "071 555 2210",
    desc: "Well maintained Pulsar with new tyres fitted last month. Minor scratch on the tank, otherwise runs like new.",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=640&q=60",
    video: "dQw4w9WgXcQ"
  },
  {
    id: "ct100-2017",
    title: "Bajaj CT100",
    category: "commuter",
    price: 195000,
    year: 2017,
    km: 34200,
    engine: "100cc",
    condition: "Fair",
    location: "Kurunegala",
    seller: "Ruwan D.",
    phone: "076 890 1122",
    desc: "Reliable daily commuter, great fuel economy. Selling because I've upgraded to a scooter.",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=640&q=60",
    video: null
  },
  {
    id: "fz-v3-2020",
    title: "Yamaha FZ V3",
    category: "sport",
    price: 495000,
    year: 2020,
    km: 15800,
    engine: "149cc",
    condition: "Excellent",
    location: "Negombo",
    seller: "Chamara K.",
    phone: "070 444 9981",
    desc: "Showroom condition. LED headlamp, digital meter, all original parts. Test rides welcome in Negombo.",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=640&q=60",
    video: "dQw4w9WgXcQ"
  },
  {
    id: "ntorq-2022",
    title: "TVS NTorq 125",
    category: "scooter",
    price: 340000,
    year: 2022,
    km: 5200,
    engine: "125cc",
    condition: "Excellent",
    location: "Galle",
    seller: "Ishara W.",
    phone: "075 321 6789",
    desc: "Almost new, bought last year. Bluetooth speedometer works perfectly. Selling due to relocation abroad.",
    image: "https://images.unsplash.com/photo-1622185135505-2d795003994a?auto=format&fit=crop&w=640&q=60",
    video: null
  },
  {
    id: "gixxer-2018",
    title: "Suzuki Gixxer",
    category: "sport",
    price: 455000,
    year: 2018,
    km: 26400,
    engine: "155cc",
    condition: "Good",
    location: "Jaffna",
    seller: "Kavin T.",
    phone: "078 213 4455",
    desc: "Sporty look, strong engine. Recently serviced with new brake pads and chain set.",
    image: "https://images.unsplash.com/photo-1580310614729-ccd69652491d?auto=format&fit=crop&w=640&q=60",
    video: "dQw4w9WgXcQ"
  },
  {
    id: "hunk-2016",
    title: "Hero Hunk",
    category: "commuter",
    price: 240000,
    year: 2016,
    km: 41000,
    engine: "150cc",
    condition: "Fair",
    location: "Matara",
    seller: "Dinesh S.",
    phone: "072 667 8890",
    desc: "Sturdy and dependable, ideal for a first bike. A few cosmetic marks but mechanically solid.",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=640&q=60",
    video: null
  },
  {
    id: "avenger-2015",
    title: "Bajaj Avenger 220",
    category: "cruiser",
    price: 365000,
    year: 2015,
    km: 38700,
    engine: "220cc",
    condition: "Good",
    location: "Anuradhapura",
    seller: "Priyantha G.",
    phone: "071 998 3320",
    desc: "Comfortable cruiser seating, great for long rides. Recent full service and new battery.",
    image: "https://images.unsplash.com/photo-1547549082-6bc09f2049ae?auto=format&fit=crop&w=640&q=60",
    video: "dQw4w9WgXcQ"
  }
];

const fmtPrice = n => "Rs " + n.toLocaleString("en-LK");
const fmtKm = n => n.toLocaleString("en-LK") + " km";

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
        <img src="${p.image}" alt="${p.title}" loading="lazy" decoding="async" width="640" height="480">
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
      <img src="${p.image}" alt="${p.title}" width="800" height="600">
    </div>
    <div class="detail-body">
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
          <span>${p.phone}</span>
        </div>
        <button class="call-btn" onclick="location.href='tel:${p.phone.replace(/\s/g,'')}'">Call</button>
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
  // iframe is only created here, on demand
  videoFrame.innerHTML = `<iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0"
      title="Bike video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen loading="lazy"></iframe>`;
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
