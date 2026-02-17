# EDHTrack 🃏

EDHTrack is a modern web application designed for Magic: The Gathering (MTG) enthusiasts to track and analyze Commander (EDH) games.

---

## 🚀 Features

- **Game Management:** Create, edit, and delete games with ease.
- **Player & Deck Tracking:** Manage your playgroup and their respective decks.
- **Deep Analytics:** View player-based statistics, win rates, and identify your most successful decks.
- **Export/Import:** Handle game data via Excel for external backups or sharing.--not yet
- **Secure:** Integrated JWT-based authentication.
- **Responsive Design:** Optimized for both desktop and mobile use.

---

## 🛠 Tech Stack

### Backend
- Java 21 with Spring Boot 3.5
- Spring Security (JWT Authentication)
- Spring Data JPA (PostgreSQL / H2)
- SpringDoc OpenAPI (Swagger UI for API documentation)
- Lombok & Apache POI

### Frontend
- React (TypeScript) with Vite
- Tailwind CSS & Lucide Icons
- Axios (API communication)
- React Toastify (Notifications)

---

## ⚙️ Configuration & Environment

The application uses spring-dotenv. Create a .env file in the backend root or set the following environment variables:

APP_JWT_SECRET=your_secret_key_at_least_32_characters_long

# For Production (Render/PostgreSQL)
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:port/db-name
SPRING_DATASOURCE_USERNAME=your_user
SPRING_DATASOURCE_PASSWORD=your_password

---

## 🛠 Getting Started

### Backend
1. Navigate to the backend folder.
2. Build and run:
   mvn clean spring-boot:run
3. API Documentation: Once the backend is running, explore the API at:  
   http://localhost:8080/swagger-ui/index.html

### Frontend
1. Navigate to the frontend folder.
2. Install & Start:
   npm install
   npm run dev
3. Open http://localhost:5173 in your browser.

---

## 🧪 Testing & Quality

- Unit & Integration Tests: Run mvn test
- Code Coverage: Run mvn verify (Report generated via JaCoCo in target/site/jacoco/index.html)

---

## 📖 API Highlights

- GET /api/games - List all recorded games
- POST /api/auth/login - Authenticate and receive JWT
- GET /api/stats/players/{id}/top-played-decks - Analytics for a specific player