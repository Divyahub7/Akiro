// TEMPORARY MOCK — replace this entire file when real JWT auth is ready.
// Contract: must populate req.user = { id: <ObjectId string> }

const mockAuth = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res
      .status(401)
      .json({ message: "x-user-id header required (mock auth)" });
  }

  req.user = { id: userId };
  next();
};

export default mockAuth;
