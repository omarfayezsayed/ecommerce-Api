import jwt from "jsonwebtoken";

class JwtGenerator {
  public signAccessToken = (user: any): string =>
    jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: `${Number(process.env.JWT_ACCESS_PERIOD)}m`,
    });

  public signRefreshToken = (user: any): string =>
    jwt.sign(
      { id: user.id }, // minimal payload — only id
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: `${Number(process.env.JWT_REFRESH_PERIOD)}d` },
    );
}

export const jwtGenerator = new JwtGenerator();
