import { useEffect, useState } from "react";
import { BookingReviewDashboardPage } from "./BookingReviewDashboardPage";

export function StaffInchargeDashboardPage() {
  const [userId] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("perms_user_id") : null
  );

  return (
    <BookingReviewDashboardPage
      title="Welcome, Staff Incharge"
      userId={userId}
      role="STAFF_IN_CHARGE"
    />
  );
}
