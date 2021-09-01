module.exports = class ApiError extends Error {
   status;
   errors;


   constructor(status, message, errors) {
      super(message);
      this.errors = errors;
      this.status = status;

   }



   static UnautharizedError() {
      return new ApiError(401, 'Unaudarizied')
   }


   static BadRequest(message, errors = [], ) {
      return new ApiError(400, message, errors)
   }
}