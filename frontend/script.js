const movies = [
  {id:"dune",title:"Dune: Part Two",genre:"Sci-Fi · Adventure",duration:"2h 46m",rating:"8.8",price:220,poster:"linear-gradient(145deg,#f6a34d,#8b3d28 42%,#10213b)",tag:"EPIC SCI-FI",description:"Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",times:["10:00 AM","1:15 PM","4:30 PM","7:45 PM"],Image:"https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg"},
  {id:"interstellar",title:"Interstellar",genre:"Sci-Fi · Drama",duration:"2h 49m",rating:"8.7",price:200,poster:"linear-gradient(145deg,#91c6cf,#2b5875 48%,#101d31)",tag:"BEYOND THE STARS",description:"A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.",times:["9:30 AM","12:45 PM","4:00 PM","7:30 PM"],Image:"https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"},
  {id:"batman",title:"The Batman",genre:"Action · Crime",duration:"2h 56m",rating:"7.8",price:180,poster:"linear-gradient(145deg,#ed4b3e,#761d2e 48%,#111827)",tag:"THE DARK KNIGHT",description:"Batman uncovers corruption in Gotham City while pursuing a mysterious criminal who leaves a trail of clues.",times:["10:15 AM","1:30 PM","5:00 PM","8:15 PM"],Image:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg"},
  {id:"deadpool",title:"Deadpool & Wolverine",genre:"Action · Comedy",duration:"2h 07m",rating:"7.9",price:250,poster:"linear-gradient(145deg,#f34a45,#a51d2e 50%,#17243a)",tag:"CHAOS MODE",description:"An unlikely pair joins forces for a wild adventure packed with action, humour and unexpected teamwork.",times:["11:00 AM","2:00 PM","5:30 PM","9:00 PM"],Image:"https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"}
];

const $ = (selector) => document.querySelector(selector);

async function loadMoviesFromBackend() {
  try {
    const response = await fetch("https://backend-fawn-zeta-62.vercel.app/movies");

    if (!response.ok) {
      throw new Error("Movies load nahi hui");
    }

    const databaseMovies = await response.json();

    const oldMovies = [...movies];
    const posterByTitle = {
  "avengers: endgame": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  "inception": "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
  "interstellar": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "the dark knight": "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
};

    const updatedMovies = databaseMovies.map((dbMovie) => {
      const existingMovie = oldMovies.find(
        (movie) =>
          movie.title.toLowerCase() === dbMovie.title.toLowerCase()
      );

      return {
        id: dbMovie._id,
        title: dbMovie.title,
        genre: dbMovie.genre,
        price: dbMovie.price,
        duration: existingMovie?.duration || "2h 00m",
        rating: existingMovie?.rating || "8.0",
        poster:
          existingMovie?.poster ||
          "linear-gradient(145deg, #334155, #111827)",
        tag: existingMovie?.tag || dbMovie.genre.toUpperCase(),
        description:
          existingMovie?.description ||
          `Enjoy ${dbMovie.title} at ShowBook cinema.`,
        times: existingMovie?.times || [
          "10:00 AM",
          "1:00 PM",
          "4:00 PM",
          "7:00 PM"
        ],
       Image: dbMovie.image || existingMovie?.Image || posterByTitle[dbMovie.title.toLowerCase()] || ""
      };
    });

    movies.splice(0, movies.length, ...updatedMovies);
    renderMovies();
    console.log("Movies loaded from MongoDB:", movies);
  } catch (error) {
    console.error("Backend connection error:", error);
    toast("Movies load nahi hui. Backend check karo.");
  }
}

const pages = ["home","movies","details","seats","confirmation","bookings"];
let currentMovie = movies[0];
let selectedTime = "";
let selectedSeats = [];
let bookings = JSON.parse(localStorage.getItem("showbook-bookings") || "[]");
let toastTimer;

function showPage(name) {
  pages.forEach(page => $(`#${page}-page`).classList.toggle("hidden", page !== name));
  document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.page === (name === "details" || name === "seats" || name === "confirmation" ? "movies" : name)));
  window.scrollTo({top:0,behavior:"smooth"});
  if (name === "bookings") renderBookings();
  if (name === "home" || name === "movies") renderMovies();
}
function  posterMarkup(movie, large = false) {
  return `<div
    class="${large ? "details-poster" : "movie-poster"}"
    style="
      --poster: ${movie.poster};
      background-image:
        linear-gradient(
          to top,
          rgba(8, 15, 25, 0.95),
          rgba(8, 15, 25, 0.05) 75%
        ),
        url('${movie.Image}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    "
  >
    ${large ? "" : `<span class="poster-kicker">${movie.tag}</span>`}
    <span class="poster-title">${movie.title}</span>
  </div>`;
}

function movieCard(movie) {
  return `<article class="movie-card">${posterMarkup(movie)}
    <div class="movie-info"><h3>${movie.title}</h3>
      <div class="movie-meta"><span class="rating">★ ${movie.rating}</span><span>${movie.duration}</span></div>
      <button class="btn primary" data-movie="${movie.id}">Book tickets · ₹${movie.price}</button>
    </div></article>`;
}
function renderMovies(query = "") {
  const filtered = movies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()) || movie.genre.toLowerCase().includes(query.toLowerCase()));
  $("#home-movies").innerHTML = movies.slice(0,4).map(movieCard).join("");
  $("#all-movies").innerHTML = filtered.length ? filtered.map(movieCard).join("") : `<div class="empty-state"><h2>No movies found</h2><p>Try a different movie title.</p></div>`;
}
function openDetails(id) {
  currentMovie = movies.find(movie => movie.id === id);
  if (!currentMovie) return;
  selectedTime = "";
  selectedSeats = [];
  $("#movie-details").innerHTML = `${posterMarkup(currentMovie,true)}
    <div class="details-copy"><p class="eyebrow">FEATURED MOVIE</p><h1>${currentMovie.title}</h1>
    <div class="movie-meta"><span class="rating">★ ${currentMovie.rating}/10</span><span>${currentMovie.duration}</span></div>
    <div class="pill-row"><span class="pill">${currentMovie.genre}</span><span class="pill">English / Hindi</span><span class="pill">2D</span></div>
    <p>${currentMovie.description}</p><h3 class="showtime-title">Choose a showtime</h3>
    <div class="showtime-list">${currentMovie.times.map(time => `<button class="showtime" data-time="${time}">${time}</button>`).join("")}</div>
    <p id="time-hint">Select a showtime to continue.</p>
    <button class="btn primary" id="choose-seats" disabled>Choose seats →</button></div>`;
  showPage("details");
}
function openSeats() {
  if (!selectedTime) return;
  selectedSeats = [];
  $("#seat-movie-summary").innerHTML = `<h1>${currentMovie.title}</h1><p>City Centre Cinema, Bhopal · ${selectedTime}</p>`;
  $("#summary-movie").innerHTML = `<strong>${currentMovie.title}</strong><span>City Centre Cinema, Bhopal</span><br><span>${selectedTime}</span>`;
  renderSeatMap();
  updateSummary();
  showPage("seats");
}
function bookedSeatIds() {
  return bookings.filter(b => b.movieId === currentMovie.id && b.time === selectedTime).flatMap(b => b.seats);
}
function renderSeatMap() {
  const rows = "ABCDEFGHIJ".split("");
  const booked = bookedSeatIds();
  $("#seat-map").innerHTML = rows.map(row => `<span class="row-label">${row}</span>${Array.from({length:10},(_,i)=>{
    const seat = `${row}${i+1}`, isBooked = booked.includes(seat), isSelected = selectedSeats.includes(seat);
    return `<button class="seat-btn ${isSelected ? "selected" : ""}" data-seat="${seat}" ${isBooked ? "disabled title='Already booked'" : ""} aria-label="Seat ${seat}${isBooked ? ", booked" : ""}">${i+1}</button>`;
  }).join("")}`).join("");
}
function updateSummary() {
  const seats = [...selectedSeats].sort();
  $("#selected-seats").textContent = seats.length ? seats.join(", ") : "None";
  $("#ticket-price").textContent = `₹${currentMovie.price} × ${seats.length}`;
  $("#total-price").textContent = `₹${currentMovie.price * seats.length}`;
  $("#confirm-booking").disabled = seats.length === 0;
  $("#booking-count").textContent = bookings.length;
}
async function createBooking() {
  if (!currentMovie || selectedSeats.length === 0) {
    toast("Please select seats first!");
    return;
  }

  const bookingData = {
    movieId: currentMovie.id,
    title: currentMovie.title,
    time: selectedTime,
    seats: [...selectedSeats],
    total: currentMovie.price * selectedSeats.length
  };

  try {
    const response = await fetch("https://backend-fawn-zeta-62.vercel.app/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) {
      throw new Error("Booking save nahi hui");
    }

    const result = await response.json();

    bookings.unshift(result.booking);
    localStorage.setItem("showbook-bookings", JSON.stringify(bookings));

    renderBookings();
    updateSummary();
    toast("Booking confirmed successfully!");
    showPage("bookings");
  } catch (error) {
    console.error("Booking error:", error);
    toast("Booking failed. Backend check karo.");
  }
}
function renderBookings() {
  $("#booking-count").textContent = bookings.length;
  if (!bookings.length) {
    $("#bookings-list").innerHTML = `<div class="empty-state"><div class="empty-icon">🎟️</div><h2>No bookings yet</h2><p>Your movie tickets will appear here after you book a show.</p><button class="btn primary" data-page="movies">Explore movies</button></div>`;
    return;
  }
  $("#bookings-list").innerHTML = bookings.map(booking => {
    const movie = movies.find(m => m.id === booking.movieId) || movies[0];
    return `<article class="booking-card"><div class="mini-poster" style="--poster:${movie.poster}">${movie.title}</div><div><h3>${booking.title}</h3><p>City Centre Cinema, Bhopal · ${booking.time}</p><p>${booking.date} · Seats: ${booking.seats.join(", ")}</p><p>Booking ID: ${booking.id}</p><p><strong>Demo total: ₹${booking.price}</strong></p></div><button class="btn" style="background:#1a2c41;color:white" data-ticket="${booking.id}">View ticket</button></article>`;
  }).join("");
}
function showTicket(id) {
  const b = bookings.find(item => item.id === id);
  if (!b) return;
  const movie = movies.find(m => m.id === b.movieId) || movies[0];
  $("#confirmation-content").innerHTML = `<div class="success-icon">✓</div><p class="eyebrow">YOUR TICKET</p><h1>${b.title}</h1><div class="ticket-box"><strong>${b.title}</strong><span>City Centre Cinema, Bhopal</span><span>${b.date} · ${b.time}</span><span>Seats: ${b.seats.join(", ")}</span><span>Booking ID: ${b.id}</span><strong style="margin-top:12px">Demo total: ₹${b.price}</strong></div><button class="btn primary full" data-page="bookings">Back to my bookings</button>`;
  currentMovie = movie;
  showPage("confirmation");
}
function toast(message) {
  const el = $("#toast"); el.textContent = message; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"),2200);
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) { event.preventDefault(); showPage(pageButton.dataset.page); return; }
  const movieButton = event.target.closest("[data-movie]");
  if (movieButton) { openDetails(movieButton.dataset.movie); return; }
  const timeButton = event.target.closest("[data-time]");
  if (timeButton) {
    selectedTime = timeButton.dataset.time;
    document.querySelectorAll(".showtime").forEach(btn => btn.classList.toggle("chosen",btn === timeButton));
    $("#choose-seats").disabled = false;
    $("#time-hint").textContent = `Selected showtime: ${selectedTime}`;
    return;
  }
  const seatButton = event.target.closest("[data-seat]");
  if (seatButton && !seatButton.disabled) {
    const seat = seatButton.dataset.seat;
    selectedSeats = selectedSeats.includes(seat) ? selectedSeats.filter(s => s !== seat) : [...selectedSeats,seat];
    renderSeatMap(); updateSummary(); return;
  }
  const ticketButton = event.target.closest("[data-ticket]");
  if (ticketButton) { showTicket(ticketButton.dataset.ticket); return; }
});
$("#explore-btn").addEventListener("click",() => showPage("movies"));
$("#movie-search").addEventListener("input",event => renderMovies(event.target.value));
document.addEventListener("click",event => {
  if (event.target.id === "choose-seats") openSeats();
  if (event.target.id === "confirm-booking") createBooking();
  if (event.target.id === "back-details") showPage("details");
});
renderMovies();
updateSummary();
showPage("home");
loadMoviesFromBackend();
