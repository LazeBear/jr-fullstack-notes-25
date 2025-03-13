module.exports = (role) => (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (user.role !== role) {
    res.status(403).json({ error: 'invalid permission' });
    return;
  }
  next();
};
