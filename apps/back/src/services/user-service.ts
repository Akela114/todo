import { generateSalt, getHash } from "@/lib/utils/hash-utils.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";
import type { FastifyInstance } from "fastify";

export default (instance: FastifyInstance) => {
  async function checkIfUserExistsService({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) {
    const [userWithEmail, userWithUsername] = await Promise.all([
      instance.userRepository.getUserByEmail(email),
      instance.userRepository.getUserByUsername(username),
    ]);

    return Boolean(userWithEmail || userWithUsername);
  }

  async function createUserService({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const isUserExists = await instance.userService.checkIfUserExistsService({
      email,
      username,
    });

    if (isUserExists) {
      throw new ValidationError("User already exists");
    }

    const passwordSalt = generateSalt();
    const passwordHash = await getHash(password, passwordSalt);

    return instance.userRepository.createUser({
      username,
      email,
      passwordSalt,
      passwordHash,
    });
  }

  return {
    createUserService,
    checkIfUserExistsService,
  };
};
