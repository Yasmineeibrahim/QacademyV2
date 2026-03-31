export const allowRoles = (...roles) => {
  return (req, res, next) => {
    const { role } = req.body;

    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};