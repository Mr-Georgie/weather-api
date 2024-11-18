export enum LogMessagesEnum {
    // Database Operations
    DB_CREATE_SUCCESS = "Record successfully created in the database.",
    DB_CREATE_FAILURE = "Failed to create record in the database.",
    DB_UPDATE_SUCCESS = "Record successfully updated in the database.",
    DB_UPDATE_FAILURE = "Failed to update record in the database.",
    DB_DELETE_SUCCESS = "Record successfully deleted from the database.",
    DB_DELETE_FAILURE = "Failed to delete record from the database.",
    DB_READ_SUCCESS = "Record successfully retrieved from the database.",
    DB_READ_FAILURE = "Failed to retrieve record from the database.",
    DB_TRANSACTION_START = "Database transaction started.",
    DB_TRANSACTION_COMMIT = "Database transaction committed successfully.",
    DB_TRANSACTION_ROLLBACK = "Database transaction rolled back due to an error.",

    // External API Operations
    API_REQUEST_INITIATED = "External API request initiated.",
    API_REQUEST_SUCCESS = "External API request completed successfully.",
    API_REQUEST_FAILURE = "External API request failed",
    API_RESPONSE_TIMEOUT = "External API request timed out.",
    API_INVALID_RESPONSE = "Received invalid response from external API.",

    // Cache Operations
    CACHE_READ_SUCCESS = "Successfully retrieved data from cache.",
    CACHE_READ_FAILURE = "Failed to retrieve data from cache.",
    CACHE_WRITE_SUCCESS = "Successfully wrote data to cache.",
    CACHE_WRITE_FAILURE = "Failed to write data to cache.",
    CACHE_DELETE_SUCCESS = "Successfully removed data from cache.",
    CACHE_DELETE_FAILURE = "Failed to remove data from cache.",
    CACHE_HIT = "Cache hit: Data retrieved from cache.",
    CACHE_MISS = "Cache miss: Data not found in cache.",

    // Authentication & Authorization
    AUTH_LOGIN_SUCCESS = "User successfully logged in.",
    AUTH_LOGIN_FAILURE = "User login attempt failed.",
    AUTH_LOGOUT_SUCCESS = "User successfully logged out.",
    AUTH_TOKEN_GENERATED = "Authentication token successfully generated.",
    AUTH_TOKEN_EXPIRED = "Authentication token expired.",
    AUTH_UNAUTHORIZED_ACCESS = "Unauthorized access attempt detected.",

    // Generic Processes
    PROCESS_INITIATED = "Process initiated.",
    PROCESS_COMPLETED = "Process completed successfully.",
    PROCESS_FAILED = "Process failed due to an error.",
    PROCESS_IN_PROGRESS = "Process is currently in progress.",

    // User Actions
    USER_CREATED = "New user account successfully created.",
    USER_DELETED = "User account successfully deleted.",
    USER_UPDATED = "User account successfully updated.",

    // Error Logging
    ERROR_OCCURRED = "An error occurred during the operation.",
    INVALID_INPUT = "Invalid input received for the process.",
    MISSING_REQUIRED_FIELD = "Required field is missing in the input.",
}
