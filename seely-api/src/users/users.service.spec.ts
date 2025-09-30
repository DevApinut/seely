import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, Role } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';


describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  const mockedBcrypt = jest.mocked(bcrypt);
  const mockRepository = {
    save: jest.fn(),
    findOneByOrFail: jest.fn(),
    upsert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        username: 'apinut',
        password: '1234',
        role: Role.USER,
      };

      const hashedPassword = '1234';
      const expectedUser: User = {
        id: 1,
        username: 'apinut',
        password: hashedPassword,
        role: Role.USER,
        keycloakId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      mockRepository.save.mockResolvedValue(expectedUser);
      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(repository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword
      });
      expect(result).toEqual(expectedUser);
    });

  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      // Arrange
      const username = 'apinut';
      const expectedUser: User = {
        id: 1,
        username,
        password: '1234',
        role: Role.USER,
        keycloakId: '1234',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOneByOrFail.mockResolvedValue(expectedUser);

      // Act
      const result = await service.findByUsername(username);

      // Assert
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ username });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('Upsert Keycloak', () => {
    it('should return KeycloakID', async () => {
      // Arrange      
      const username = 'apinut';
      const keycloakId = '1234';
      const upsertResult = {};
      const expectedUser: User = {
        id: 1,
        username,
        password: '1234',
        role: Role.USER,
        keycloakId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.upsert.mockResolvedValue(upsertResult);
      mockRepository.findOneByOrFail.mockResolvedValue(expectedUser);

      // Act
      const result = await service.upsertByKeycloakId(username, keycloakId);

      // Assert
      expect(repository.upsert).toHaveBeenCalledWith(
        { username, keycloakId },
        { conflictPaths: ['keycloakId'] }
      );
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({ keycloakId });
      expect(result).toEqual(expectedUser);
    });
  });

});