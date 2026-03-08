import jwt from "jsonwebtoken";

class JwtGenerator {
  public signAccessToken = (user: any): string =>
    jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: "15m",
      },
    );

  public signRefreshToken = (user: any): string =>
    jwt.sign(
      { id: user._id }, // minimal payload — only id
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );
}

export const jwtGenerator = new JwtGenerator();
