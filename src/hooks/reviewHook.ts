import { useState, useEffect } from 'react';
import axios from 'axios';

const createReview = (ucId: number, classId: number, studentId: number, value: any, comment:any, participationId: any/*refreshClasses: () => void*/) => {
    
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
      //refreshClasses();
    })
    .catch(() => {
        console.error("Error creating class.");
    });
  };

export { createReview };