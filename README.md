# Weather API Proxy

## Project Overview

A comprehensive NestJS backend application that provides weather information through REST and GraphQL interfaces, with robust features including:

-   Third-party weather API integration
-   User authentication
-   Favorite locations management
-   Caching mechanisms
-   Rate limiting
-   Background job synchronization

## Technology Stack

-   **Backend Framework**: NestJS
-   **Database**: PostgreSQL
-   **ORM**: TypeORM
-   **Caching**: Redis
-   **Authentication**: JWT
-   **API Types**: REST & GraphQL
-   **Job Queue**: Bull
-   **Rate Limiting**: NestJS Throttler

## Prerequisites

-   Node.js (v20.x or later)
-   npm (v10.x or later)
-   PostgreSQL (v12.x or higher)
-   Redis

## Environment Configuration

### Application Settings

-   `PORT`: Server listening port (default: 8080)
-   `CLIENT`: Frontend application URL

### Authentication

-   `JWT_SECRET`: Secret key for JWT token generation
-   `ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC`: Token expiration time

### Database Configuration

-   `DATABASE_HOST`: PostgreSQL database host
-   `DATABASE_PORT`: Database port
-   `DATABASE_USER`: Database username
-   `DATABASE_PASS`: Database password
-   `DATABASE_NAME`: Database name

### External API Configuration

-   `WEATHER_API_KEY`: WeatherAPI.com API key
-   `WEATHER_API_CURRENT_CITY_URL`: Current weather endpoint
-   `WEATHER_API_CITY_FORECAST_URL`: Forecast endpoint

### Redis Configuration

-   `REDIS_URL`: Complete Redis connection URL
-   `REDIS_HOST`: Redis server host
-   `REDIS_PORT`: Redis server port
-   `REDIS_USER`: Redis username
-   `REDIS_PASS`: Redis password
-   `REDIS_DB`: Redis database number
-   `REDIS_TTL`: Cache time-to-live (default: 1 minute)

### Rate Limiting

-   `PUBLIC_RATE_LIMIT_TTL`: Public endpoints time-to-live (default: 1 minute)
-   `PUBLIC_RATE_LIMIT`: Public endpoints rate limit
-   `AUTH_RATE_LIMIT_TTL`: Authenticated endpoints time-to-live (default: 1 minute)
-   `AUTH_RATE_LIMIT`: Authenticated endpoints rate limit
-   `WEATHER_RATE_LIMIT_TTL`: Weather query endpoints time-to-live (default: 1 minute)
-   `WEATHER_RATE_LIMIT`: Weather query endpoints rate limit
-   `FORECASE_RATE_LIMIT_TTL`: Forecast query endpoints time-to-live (default: 1 minute)
-   `FORECASE_RATE_LIMIT`: Forecast query endpoints rate limit

-   Separate rate limits for:
    -   Public endpoints
    -   Authenticated routes (locations endpoints are protected)
    -   Weather-specific endpoints
    -   Forecast endpoints

### Background Job

-   `WEATHER_SYNC_CRON`: Cron schedule for weather data synchronization

## Installation

1. Clone the repository

```bash
git clone https://github.com/mr-georgie/weatherapi.git
cd weatherapi
```

2. Install dependencies

```bash
npm install
```

3. Create .env file

```bash
cp .env.sample .env
# Edit .env with your specific configurations
```

## Database Setup

### Migrations

```bash
# Generate migrations
npm run migration:generate

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Testing

```bash
# Run unit tests
npm run test

# Run test coverage
npm run test:cov
```

## API Documentation

1. Swagger documentation available at:

```bash
http://localhost:8080/api
```

2. GraphQL Playground:

```bash
http://localhost:8080/graphql
```

## Caching Strategy

-   Redis used for caching external API responses
-   Default TTL: 1 minute
-   Helps reduce external API calls and improve response times

## Rate Limiting

Implemented to prevent API abuse:

-   Separate limits for different endpoint types
-   Configurable per route
-   Uses sliding window strategy

## Authentication

-   JWT-based authentication
-   Secure token generation
-   Token expiration management

## Background Jobs

-   Periodic weather data synchronization
-   Configurable via cron expression
-   Helps keep favorite locations updated
