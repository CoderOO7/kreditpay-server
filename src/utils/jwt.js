const jwt = require("jsonwebtoken");

module.exports = {
  /**
   * Middleware to validate token
   */
  validateToken: (req, res, next) => {
    let result = {};
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
      const token = req.headers.authorization.split(" ")[1];
      const options = {
        expiresIn: "1d",
      };
      try {
        // return decoded token
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        // pass execution to subsequent middleware
        next();
      } catch (err) {
        result = {
          errors: [
            {
              title: "Authentication Error",
              message: "Provided Token is invalid",
            },
          ],
          status: 401,
        };
        res.status(401).send(result);
      }
    } else {
      result = {
        errors: [
          {
            title: "Authentication Error",
            message: "Token is required",
          },
        ],
        status: 401,
      };
      res.status(401).send(result);
    }
  },
};
