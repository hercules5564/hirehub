const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    isVerified: user.isVerified,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = sendTokenResponse;
