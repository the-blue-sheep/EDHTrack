# EDHTrack

EDHTrack is a web application for tracking and analyzing Commander (EDH) games.  
It allows players to record games, manage decks and players, and view statistics such as most played or most successful decks.

---

## Features

- Create, edit and delete games
- Assign players and decks to games
- Track winners and game notes
- View player-based deck statistics
- Analyze top played and top successful decks
- Responsive web interface

---

## Tech Stack

### Frontend
- React (TypeScript)
- Vite
- React Router
- Axios
- Tailwind CSS
- React Toastify

### Backend
- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA (Hibernate)
- Spring Validation
- Lombok

### Database
- PostgreSQL (production)
- H2 (tests)

### Testing
- JUnit 5
- Mockito
- Spring Boot Test

### Tooling & Infrastructure
- Maven
- Vite
- ESLint
- JaCoCo (code coverage)
- Apache POI (Excel export/import)
- spring-dotenv (environment configuration)

---

## Getting Started

### Prerequisites

- Java 21
- Node.js (LTS recommended)
- PostgreSQL
- Maven

---

## Backend Setup
Configure database access in `application.yml` or via environment variables.
   
### Run the backend:
```bash
  mvn spring-boot:run
```

### The backend will be available at:
http://localhost:8080




## Frontend Setup

#### Install dependencies:
```bash
npm install
```

#### Install dependencies:
```bash
  npm install
```

### Start development server:
```bash
  npm run dev
```

### The frontend will be available at:
http://localhost:5173


# API Overview
- GET /api/games
- GET /api/games/{id}
- POST /api/games
- PUT /api/games/{id}
- DELETE /api/games?id={id}
- GET /api/stats/players/{id}/top-played-decks
- GET /api/stats/players/{id}/top-successful-decks

# Testing

### Run backend tests with:
```bash
  mvn test
```

### Generate code coverage report:
```bash
  mvn verify
```