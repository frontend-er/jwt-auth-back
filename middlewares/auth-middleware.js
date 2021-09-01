const ApiError = require("../exceptions/api-erroe");
const tokenService = require("../services/token-service");


module.exports = function (req, res, next) {
   try {
      const autorizationHeader = req.headers.authorization;
      if (!autorizationHeader) {
         return next(ApiError.UnautharizedError())
      }

      const accessToken = autorizationHeader.split(' ')[1];
      if (!accessToken) {
         return next(ApiError.UnautharizedError())
      }


      const userData = tokenService.validateAccessToken(accessToken)

      if (!userData) {
         return next(ApiError.UnautharizedError())
      }


      req.user = userData;
      next()
   } catch (error) {
      return next(ApiError.UnautharizedError())
   }
}