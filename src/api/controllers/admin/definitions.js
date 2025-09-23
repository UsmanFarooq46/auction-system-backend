const errorResp = require("./../../../utils/error_response");

const addTeacher = async (req, res, next) => {
  try {
    // const newTeacher = new teacherModel(req.body);
    // let saved_teacher = await newTeacher.save(newTeacher);
    // res.status(200).send(saved_teacher);
  } catch (err) {
    next(new errorResp(err, "error in saving techer", 401));
  }
};

module.exports = {
  addTeacher,
};
