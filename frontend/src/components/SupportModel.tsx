export const handleSupportClick = () => {
  const email = "support@gmail.com";
  const subject = encodeURIComponent("Support Request - Civic Report");
  const body = encodeURIComponent(
    "Hello Support Team,\n\nI need help with the following issue:\n\n[Describe your issue here]\n\nThank you."
  );

  // This opens the user's email client with pre-filled details
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};
