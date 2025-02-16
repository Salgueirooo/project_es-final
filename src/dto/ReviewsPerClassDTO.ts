import { ReviewDTO } from "./ReviewDTO";

export interface ReviewsPerClasseDTO {
    classId: number;
    reviews: ReviewDTO[];
}