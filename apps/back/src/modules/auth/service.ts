import { getHash } from "@/lib/utils/hash-utils.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";
import type { FastifyInstance } from "fastify";

export class AuthService {
  constructor(private instance: FastifyInstance) {}

  async getAuthenticatedUser(username: string, password: string) {
    const user = await this.instance.usersService.getOneByUsername(username);

    if (!user) {
      throw new ValidationError("Invalid credentials");
    }

    const passwordHash = await getHash(password, user.passwordSalt);

    if (passwordHash !== user.passwordHash) {
      throw new ValidationError("Invalid credentials");
    }

    return user;
  }
}
