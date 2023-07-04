exports.forbidHandler = async (model, id) => {
  const forbid = await model.findOneAndUpdate(
    { _id: id },
    { visible: false },
    { new: true }
  );
  return forbid;
};

exports.isExesistingAndVisible = async (model, id) => {
  const isExesistingAndVisible = await model.findOne({
    _id: id,
    visible: true,
  });
  return isExesistingAndVisible;
};

exports.isAvilableUser = async (model, username, email) => {
  const isAvilableUser = await model.findOne({
    username: username,
    email: email,
    visible: true,
  });
  return isAvilableUser;
};
