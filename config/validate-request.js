module.exports = validateRequest;
function validateRequest(req, res, next, schema, querySchema, page) {
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
    console.log({error:errorObj});
    res.status(400).render(page, {errors:JSON.stringify(errorObj)});
  } else {
    if(querySchema)req.query = value;
    else req.body = value;
    next();
  }
}
  
  