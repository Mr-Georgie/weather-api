export interface PaginatedResponse<T = any> {
    results: T[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

export function createPaginatedResponse<T>(
    results: T[],
    page: number,
    limit: number,
    totalItems: number,
): PaginatedResponse<T> {
    const totalPages = Math.ceil(totalItems / limit);

    return {
        results: results,
        currentPage: page,
        pageSize: limit,
        totalPages: totalPages,
        totalItems: totalItems,
    };
}
