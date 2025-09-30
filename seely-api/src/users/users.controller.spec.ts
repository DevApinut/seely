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

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'apinut',
        password: '1234',
        role: Role.USER,
      };
      const expectedUser: User = {
        id: 1,
        username: 'apinut',
        password: '1234',
        role: Role.USER,
        keycloakId: 'Donut_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUsersService.create.mockResolvedValue(expectedUser);
      const result = await controller.create(createUserDto);
      // Assert
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findByUsername', () => {
    it('should return user', async () => {
      
      const loggedInUser: LoggedInDto = {
        username: 'apinut',
        role: 'USER',
      };

      const expectedUser: User = {
        id: 1,
        username: 'apinut',
        password: '1234',
        role: Role.USER,
        keycloakId: 'Donut_id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mocklogin = { user: loggedInUser };
      mockUsersService.findByUsername.mockResolvedValue(expectedUser);

      // Act
      const result = await controller.findByUsername(mocklogin);

      // Assert
      expect(mockUsersService.findByUsername).toHaveBeenCalledWith(mocklogin.user.username); 
      expect(mockUsersService.findByUsername).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });
  });
});
