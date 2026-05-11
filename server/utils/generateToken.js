import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  // Include role in token so middleware doesn't need a DB lookup
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" },
  );

  const isProduction = process.env.NODE_ENV === "production";

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
    })
    .json({
      success: true,
      message,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl,
        enrolledCourses: user.enrolledCourses,
      },
    });
};
