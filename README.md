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

-   `PORT`: Server listening port (default: 3000)
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
http://localhost:3000/api
```

2. GraphQL Playground:

```bash
http://localhost:3000/graphql
```

## Design Decisions and Architecture Rationale

### GraphQL for Weather Data Fetching

-   **Motivation**: Provide flexible API access
-   **Implementation**:
    -   GraphQL for weather data fetching
-   **Benefits**:

    -   Precise Data Retrieval:
        -   Weather forecast data is large and complex
        -   GraphQL allows clients to request exactly the data they need
        -   Prevents over-fetching or under-fetching of information
        -   Significant bandwidth savings
        -   Lower data transfer costs
        -   Flexible Schema Design

-   Sample Query

```bash
query {
  getCurrentCityWeather(city: "London") {
    # Client can select only required fields
    location {
      name
      country
      lat
      lon
      region
      tz_id
    }
    current {
      temp_c
    }
  }
}
```

### REST API for location CRUD operations and Auth Endpoints

-   **Why REST for Authentication**:

    -   More straightforward session management
    -   Industry standard for auth flows
    -   Better support for HTTP-only cookies
    -   Clearer security headers handling
    -   Simpler implementation of token-based auth
    -   More intuitive error handling for auth failures
    -   Simpler request/response cycle
    -   Easier to implement middleware for auth check

-   **Why REST for Location Management**:
    -   Natural fit for CRUD operations
    -   Clear HTTP method mapping:
        -   POST: Create new location
        -   GET: Retrieve locations
        -   DELETE: Remove location

### Caching Strategy
- **Approach**: Redis-based caching with differentiated TTL
- **Rationale**: 
  - Shorter TTL for current weather (smaller dataset)
  - Longer TTL for forecast data
- **Performance Optimization**: 
  - Reduced external API calls
  - Improved response times
  - Cost-effective API usage

### Authentication and Security
- **Authentication Mechanism**: JWT-based
- **Security Enhancements**:
  - Password hashing
  - UUID for primary keys (prevents IDOR)
  - Soft deletion of records
  - Recommended HTTP-only cookies for production
- **Input Sanitization**: 
  - Transform inputs to lowercase
  - DTO validation

### Background Job Management
- **Technology**: Bull job queue
- **Purpose**: 
  - Periodic weather data synchronization
  - Configurable cron jobs
  - Efficient background processing

### Code Quality and Maintainability
- **Type Safety**:
  - Extensive use of interfaces
  - Enums to replace magic strings
- **Modularization**:
  - Dependency Injection (DI)
  - Service-specific exception handling
- **Logging**:
  - Comprehensive logging
  - Improved debugging
  - Enhanced monitoring capabilities

### AppConfig Service
- **Functionality**: 
  - Centralized environment variable management
  - Default value setting
  - Graceful error handling during configuration

### Testing Strategy
- **Focus Areas**:
  - Core services (Weather Service)
  - External API data service
  - User services relating to authentication
- **Purpose**: 
  - Ensure core functionality
  - Validate critical components

### API Response Standardization
- **Implementation**: Standard API response object
- **Benefits**:
  - Consistent response structure
  - Easier client-side parsing
  - Improved error handling

## Future Improvements

- [ ] Implement HTTP-only cookies
- [ ] Add token rotation and refresh mechanisms
- [ ] Implement Caching invalidation
- [ ] Implement more comprehensive test coverage
- [ ] Extend caching strategies
- [ ] Authentication on GraphQL endpoints
