# ShowBook — Frontend movie ticket booking demo

## Run it
1. Extract the `showbook` folder.
2. Open `index.html` in your browser, or open the folder in VS Code and use Live Server.
3. Internet is only needed to load the optional Google Font. The app itself uses no libraries.

## Files
- `index.html` — page structure
- `style.css` — responsive dark theme
- `script.js` — movie list, navigation, seat selection, booking and localStorage

## Included demo features
- Movie listing and search
- Movie details and showtime selection
- Interactive 10 × 10 seat map
- Prevents selecting seats already booked in this browser for the same movie/showtime
- Booking confirmation and My Bookings page
- Saves bookings in this browser using localStorage

## Important limitations
This is a frontend-only learning project. Data is stored only in the current browser and can be cleared by the user. It does not provide secure multi-user booking, real-time seat locking, authentication, a backend database, QR tickets, or payments. For a production project, add a backend API and database, enforce seat uniqueness on the server, and integrate a payment provider's test mode.
