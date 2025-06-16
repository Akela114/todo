import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "@/repository/user-repository.js";
import { generateSalt, getHash } from "@/lib/utils/hash-utils.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";

const checkIfUserExistsService = async ({
  email,
  username,
}: {
  email: string;
  username: string;
}) => {
  const [userWithEmail, userWithUsername] = await Promise.all([
    getUserByEmail(email),
    getUserByUsername(username),
  ]);

  return Boolean(userWithEmail || userWithUsername);
};

export const createUserService = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => {
  const isUserExists = await checkIfUserExistsService({
    email,
    username,
  });

  if (isUserExists) {
    throw new ValidationError("User already exists");
  }

  const passwordSalt = generateSalt();
  const passwordHash = await getHash(password, passwordSalt);

  return createUser({
    username,
    email,
    passwordSalt,
    passwordHash,
  });
};
