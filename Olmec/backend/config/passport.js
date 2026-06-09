const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (googleClientId && googleClientSecret) {
        passport.use(new GoogleStrategy({
            clientID: googleClientId,
            clientSecret: googleClientSecret,
            callbackURL: "/api/auth/google/callback"
        }, async (accessToken, refreshToken, profile, cb) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.findOne({ email: profile.emails[0].value });
                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                    } else {
                        user = new User({
                            username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            profile: {
                                photo: profile.photos[0]?.value,
                                profession: 'Creator',
                                bio: 'Joined via Google'
                            },
                            profileComplete: true
                        });
                        await user.save();
                    }
                }
                return cb(null, user);
            } catch (err) {
                return cb(err, null);
            }
        }));
    } else {
        console.warn('Google OAuth not configured: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not set');
    }

    const githubClientId = process.env.GITHUB_CLIENT_ID;
    const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (githubClientId && githubClientSecret) {
        passport.use(new GitHubStrategy({
            clientID: githubClientId,
            clientSecret: githubClientSecret,
            callbackURL: "/api/auth/github/callback",
            scope: ['user:email']
        }, async (accessToken, refreshToken, profile, cb) => {
            try {
                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.placeholder.com`;
                    user = await User.findOne({ email: email });
                    if (user) {
                        user.githubId = profile.id;
                        await user.save();
                    } else {
                        user = new User({
                            username: profile.username,
                            email: email,
                            githubId: profile.id,
                            profile: {
                                photo: profile.photos[0]?.value,
                                profession: 'Developer',
                                bio: profile._json.bio || 'Joined via GitHub',
                                socialLinks: { github: profile.profileUrl }
                            },
                            profileComplete: true
                        });
                        await user.save();
                    }
                }
                return cb(null, user);
            } catch (err) {
                return cb(err, null);
            }
        }));
    } else {
        console.warn('GitHub OAuth not configured: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET not set');
    }
};
