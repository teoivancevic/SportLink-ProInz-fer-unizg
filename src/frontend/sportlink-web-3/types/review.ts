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

export interface Distribution {
    oneStar: number,
    twoStars: number,
    threeStars: number,
    fourStars: number,
    fiveStars: number,
}

export interface ApiDistribution {
    [key: number]: number;
}

export interface ReviewDistributionResponse {
    data: ApiDistribution
}

export interface CreateReviewResponse {
    rating: number,
    description: string,
    response: string,
    userFirstName: string,
    userLastName: string,
    organizationName: string
}

export interface RespondReviewRequest {
    organizationId: number, 
    userId: number, 
    response: string
}

export interface CreateReviewRequest {
    organizationId: number,
    rating: number,
    description: string
}