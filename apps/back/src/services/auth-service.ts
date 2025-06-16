import { getUserByUsername } from "@/repository/user-repository.js";
import { getHash } from "@/lib/utils/hash-utils.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";

export const getAuthenticatedUser = async (
  username: string,
  password: string
) => {
  const user = await getUserByUsername(username);

  if (!user) {
    throw new ValidationError("Invalid credentials");
  }

  const passwordHash = await getHash(password, user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    throw new ValidationError("Invalid credentials");
  }

  return user;
};
