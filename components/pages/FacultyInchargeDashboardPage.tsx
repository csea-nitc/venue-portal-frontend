'use client';

import { useEffect, useState } from "react";
import { BookingReviewDashboardPage } from "./BookingReviewDashboardPage";

export function FacultyInchargeDashboardPage() {
  const [userId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("perms_user_id") : null
  );

  return (
    <BookingReviewDashboardPage
      title="Welcome, Faculty In Charge"
      userId={userId}
      role="FACULTY_IN_CHARGE"
    />
  );
}
