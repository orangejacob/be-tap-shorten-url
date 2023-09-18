# Backend - Shortening URL

### Introduction

This backend server handles the shortening and storing of URLs, user authentication, and user management. It is built to work in a Dockerized environment and utilizes PostgreSQL as its database and TypeORM for ORM.

### Running the Server

#### Prerequisites:

- Docker and Docker Compose installed on your machine.

#### Steps:

1. Open a terminal and navigate to the project's root directory.
2. Run the following command:

   ```bash
   docker-compose up
   ```

3. The server will start and be accessible on port `8000`.

### Modules

#### 1. URL:

This module handles the shortening and storing of URLs.

#### 2. Auth:

Used for authenticating users.

#### 3. User:

Responsible for user management functionalities.

### Database

The server uses PostgreSQL as its primary database, and interactions with the database are facilitated by TypeORM. The following tables are present:

- `User`: For storing user-related data.
- `URL`: For storing the original URLs and their shortened codes.

### Shortening Logic

1. A unique code for shortening is generated using a combination of MD5 and Base62 encoding.
2. An MD5 hash is created from the combination of a UUID and the sender's username. This is to ensure the prevention of any collusion.
3. The resultant hash is then transformed into a shortcode using Base62 encoding, making it alphanumeric. A substring of this result is taken for the shortcode.
4. If a shortcode already exists in the database, the shortening function is rerun until a unique code is generated.
5. Incoming GET request on `/urls/:shortcode` will return the original URL.

### Limitations

Given more time, I will:

- Write unit and e2e test cases.
- Use Redis to store shortcode.

---
