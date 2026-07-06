import { BookingReviewDashboardPage } from "./BookingReviewDashboardPage";

export function StaffInchargeDashboardPage() {
  const userId = localStorage.getItem("perms_user_id");
  console.log(userId);
  return (
    <BookingReviewDashboardPage
      title="Welcome, Staff Incharge"
      userId={userId || undefined}
    />
  );
}
