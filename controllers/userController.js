
exports.renderProfile = (req, res, next) => {
  try {
    const person = req.user;
    if (!person) {
      // Handle the case when the user object is not available
      return res.redirect('/');
    }
    res.render('profile', { person });
  } catch (error) {
    next(error);
  }
};


exports.renderKecamatanPage = (req, res) => {
  res.render('kecamatan');
};




