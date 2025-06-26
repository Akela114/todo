import type { user } from "@/db/schema.js";
import { BaseService } from "@/lib/base-classes/base-service.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";
import { generateSalt, getHash } from "@/lib/utils/hash-utils.js";
import type { UsersRepository } from "./repository.js";

export class UsersService extends BaseService<typeof user, "id"> {
  constructor(protected repository: UsersRepository) {
    super(repository, "User");
  }

  async getOneByEmail(...args: Parameters<UsersRepository["getOneByEmail"]>) {
    return this.repository.getOneByEmail(...args);
  }

  async getOneByUsername(
    ...args: Parameters<UsersRepository["getOneByUsername"]>
  ) {
    return this.repository.getOneByUsername(...args);
  }

  async createWithPasswordGeneration({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    const isUserExists = await this.checkIfExistsWithEmailOrUsername({
      email,
      username,
    });

    if (isUserExists) {
      throw new ValidationError(`${this.entityName} already exists`);
    }

    const passwordSalt = generateSalt();
    const passwordHash = await getHash(password, passwordSalt);

    return this.create({
      username,
      email,
      passwordSalt,
      passwordHash,
    });
  }

  private async checkIfExistsWithEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) {
    const [userWithEmail, userWithUsername] = await Promise.all([
      this.getOneByEmail(email),
      this.getOneByUsername(username),
    ]);

    return Boolean(userWithEmail || userWithUsername);
  }
}
