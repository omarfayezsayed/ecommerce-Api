import bcrypt from "bcryptjs";

export class AuthService {
  public signUp = async (email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const bool = await bcrypt.compare(
      "12343s",
      "$2b$10$4C8fi/dIGFuY2vj6F84hiOD7Iccn90cJxviuRSlz0.15BuNeds4Sm",
    );
    console.log(hashedPassword);
  };
}
