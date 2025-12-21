if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Admin access denied" });
}