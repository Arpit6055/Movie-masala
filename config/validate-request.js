module.exports = validateRequest;
function validateRequest(req, res, next, schema, querySchema) {
  try {
    const options = {
      abortEarly: true, // include all errors = false
      allowUnknown: true, // ignore unknown props
      stripUnknown: true, // remove unknown props
    };
    var { error, value } = querySchema?schema.validate(req.query, options):schema.validate(req.body, options);
    if (error) {
      let errorObj = [];
      error.details.forEach((e) => {
        let tob = {};
        tob[e.context.key] = e.message.replace(/['"]/g, "");
        errorObj.push(tob);
      });
      console.log({msg : "Error in Joi validation",error:{...errorObj[0]}});
      res.status(400).render("error", {message:JSON.stringify(errorObj)});
    } else {
      if(querySchema){
        req.query = value;
      }
      else req.body = value;
      next();
    }
  } catch (error) {
    console.log({msg:"Error in validateRequest",error});
  }
 
}
  
  