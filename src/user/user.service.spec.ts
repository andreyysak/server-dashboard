import {UserService} from "./user.service";
import {Repository} from "typeorm";
import {User} from './entities/user.entity'
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {NotFoundException} from "@nestjs/common";

describe('UserService', () => {
  let service: UserService
  let repo: Repository<User>

  const mockUserRepository = {
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
    repo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('має повернути юзера, якщо він існує', async () => {
      const mockUser = { user_id: 1, email: 'test@test.com' };
      mockUserRepository.findOne.mockReturnValue(mockUser);

      const result = await service.getUser(1);
      expect(result).toEqual(mockUser);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { user_id: 1 } });
    });

    it('має викинути NotFoundException, якщо юзера немає', async () => {
      mockUserRepository.findOne.mockReturnValue(null);

      await expect(service.getUser(1)).rejects.toThrow(NotFoundException);
    });
  });
})