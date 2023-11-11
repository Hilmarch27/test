const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        console.log('Attempting login with email:', email);

        const user = await User.findOne({ email });

        if (!user) {
          console.log('User not found.');
          return done(null, false, { message: 'Email not registered.' });
        }

        const isMatch = await user.isValidPassword(password);
        if (isMatch) {
          console.log('Login successful.');
          return done(null, user);
        } else {
          console.log('Incorrect password.');
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        return done(error);
      }
    }
  )
);



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;