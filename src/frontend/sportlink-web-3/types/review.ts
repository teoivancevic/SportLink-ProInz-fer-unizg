export interface Review{
    rating: number,
    description: string,
    response: string,
    userFirstName: string,
    userLastName: string,
    organizationName: string
};

export interface GetReviewsResponse {
    data: Review[]
}

export interface Stats {
    averageRating: number,
    reviewCount: number
}

export interface ReviewStatsResponse {
    data: Stats
}

export interface ReviewDistributionResponse {
    one: number,
    two: number,
    three: number,
    four: number,
    five: number,
}

export interface CreateReviewRequest {
    orgId: number,
    rating: number,
    description: string
}

export interface CreateReviewResponse {
    rating: 0,
    description: string,
    response: string,
    userFirstName: string,
    userLastName: string,
    organizationName: string
}
