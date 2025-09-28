import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role, User } from './entities/user.entity';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    // Create function for mock data
    create: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.USER,
      };

      const expectedUser: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        role: Role.USER,
        keycloakId: 'Donut_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      //   Setup return mock
      mockUsersService.create.mockResolvedValue(expectedUser);

      //   call create for return mock
      const result = await controller.create(createUserDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(usersService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByUsername', () => {
    it('should return user by username from request', async () => {
      // Arrange
      const loggedInUser: LoggedInDto = {
        username: 'testuser',
        role: 'USER',
      };

      const expectedUser: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
        role: Role.USER,
        keycloakId: 'Donut_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockRequest = { user: loggedInUser };
      mockUsersService.findByUsername.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.findByUsername(mockRequest);

      // Assert
      expect(usersService.findByUsername).toHaveBeenCalledWith('testuser'); 
      expect(usersService.findByUsername).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });
  });
});
