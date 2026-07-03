// Controllers contain the actual logic for a route.
// This one just confirms the server is alive and responding.
export const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 🚀",
    timestamp: new Date().toISOString(),
  });
};