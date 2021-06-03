import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: IUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able to authenticate an user", async () => {
    const user = await createUserUseCase.execute({
      email: "test@test.test",
      name: "Test User",
      password: "test"
    })

    const responseToken = await authenticateUserUseCase.execute({
      email: "test@test.test",
      password: "test"
    })

    expect(responseToken).toHaveProperty("token")
    expect(responseToken.user.name).toEqual("Test User")
  })

  it("should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@test.test",
        password: "test"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("should not be able to authenticate an with incorrect password", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@test.test",
        name: "Test User",
        password: "test"
      })

      await authenticateUserUseCase.execute({
        email: "test@test.test",
        password: "incorrectpassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
