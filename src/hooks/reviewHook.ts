import { useState, useEffect } from 'react';
import axios from 'axios';
import { ReviewDTO } from '../dto/ReviewDTO';
import { ReviewsPerClasseDTO } from '../dto/ReviewsPerClassDTO';

const useReviews = (classId: number | null) => {
    const [reviews, setReviews] = useState<ReviewDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchReviewsByClassId = async (classId: number) => {
        try {
          const response = await axios.get(`http://localhost:8080/api/reviews/get-reviews-by-class/${classId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setReviews(response.data);
          setError(null);
          //setIsClassesPopupOpen(true); // Open the popup after fetching the data
        } catch (error) {
          console.error("Error fetching classes:", error);
          setError('Erro ao listar as aulas');
        }
    };

    useEffect(() => {
        if(classId) {
          fetchReviewsByClassId(classId);
        }
        
    }, [refreshKey]);

    const refreshReviews = () => {
        setRefreshKey(prev => prev + 1);
    };

    return { reviews, error, refreshReviews };
};

const useAllReviews = () => {
  const [allReviews, setAllReviews] = useState<ReviewsPerClasseDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewsByClassId = async (ucId: number | null) => {
      if (!ucId) return;

      try {
        const response = await axios.get(`http://localhost:8080/api/reviews/get-reviews-per-class-by-uc/${ucId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAllReviews(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Erro ao listar as aulas");
      }
  };

  return { allReviews, error, fetchReviewsByClassId };
};

const createReview = (ucId: number, classId: number, studentId: number, value: any, comment:any, participationId: any, refreshClasses: () => void) => {
    
    axios.post(
        `http://localhost:8080/api/reviews/set-review-to-student/${ucId}/${classId}/${studentId}`,
        {value, comment, participationId},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        }
    )
    .then(() => {
      console.log("Class created.");
      refreshClasses();
    })
    .catch(() => {
        console.error("Error creating class.");
    });
  };

export { useReviews, useAllReviews, createReview };