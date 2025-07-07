import { ValidationError } from "@/lib/errors/bad-request-error.js";
import { Service } from "@/lib/types.js";
import { generateSalt, getHash } from "@/lib/utils/hash-utils.js";
import type { UsersRepository } from "./repository.js";

export class UsersService extends Service<UsersRepository> {
  constructor(protected repository: UsersRepository) {
    super(repository);
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
      throw new ValidationError("User already exists");
    }

    const passwordSalt = generateSalt();
    const passwordHash = await getHash(password, passwordSalt);

    return this.create(
      {},
      {
        username,
        email,
        passwordSalt,
        passwordHash,
      },
    );
  }

  private async checkIfExistsWithEmailOrUsername({
    email,
    username,
  }: {
    email: string;
    username: string;
  }) {
    const [userWithEmail, userWithUsername] = await Promise.all([
      this.getFirst({ email }),
      this.getFirst({ username }),
    ]);

    return Boolean(userWithEmail || userWithUsername);
  }
}
