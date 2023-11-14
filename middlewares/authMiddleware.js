// middlewares/authMiddleware.js
module.exports = {
  ensureAuthentication: async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        console.log('User authenticated:', req.user);
        next();
      } else {
        console.log('User not authenticated');
        res.redirect('/auth/login');
      }
    } catch (error) {
      next(error);
    }
  },  

  ensureAdmin: (req, res, next) => {
    try {
      console.log('Middleware: ensureAdmin - User role:', req.user.role);
      if (req.user && req.user.role === 'ADMIN') {
        return next();
      } else {
        return res.redirect('/auth/login');
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  
  ensureKecamatan: (req, res, next) => {
    try {
      console.log('Middleware: ensureAdmin - User role:', req.user.role);
      if (req.user && req.user.role === 'KECAMATAN') {
        return next();
      } else {
        return res.redirect('/');
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  
  ensurePetugas: (req, res, next) => {
    try {
      if (req.user && req.user.role === 'PETUGAS') {
        return next();
      } else {
        return res.redirect('/');
      }
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },

};