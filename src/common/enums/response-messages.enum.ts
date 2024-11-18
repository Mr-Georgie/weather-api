export enum ResponseMessagesEnum {
    // Success messages
    LOGIN_SUCCESS = "Login successful",
    SIGNUP_SUCCESS = "Signup successful",
    SUCCESS = "Request successful",
    UPDATE_SUCCESS = "Update successful",
    CREATED = "Created successfully",

    // Error messages
    EMAIL_ALREADY_EXISTS = "Email already exists",
    EMAIL_NOT_FOUND = "Email doesn't exists",
    ACCOUNT_NOT_FOUND = "Account not found",
    PASSWORD_MISMATCH = "Password does not match",
    INVALID_DETAILS = "Invalid details passed",
    BAD_REQUEST = "BAD_REQUEST",
    UNAUTHORIZED = "Unauthorized. Please login",
    USER_PERMISSION_DENIED = "You do not have permission to do this",
    FORBIDDEN = "Forbidden resource",

    // Server messages
    SERVER_ERROR = "Internal server error. Contact developer",
    API_KEY_LIMIT_ISSUES = "There's an API key/limit issue",
}
