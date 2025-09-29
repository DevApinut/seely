import { Test, TestingModule } from '@nestjs/testing';
import { SuggestController } from './suggest.controller';
import { SuggestService } from './suggest.service';
import { CreateSuggestDto } from './dto/create-suggest.dto';
import { UpdateSuggestDto } from './dto/update-suggest.dto';
import { Suggest } from './entities/suggest.entity';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { IdDto } from '@app/common/dto/id.dto';
import { Role } from '@app/users/entities/user.entity';

describe('SuggestController', () => {
    let controller: SuggestController;
    let suggestService: SuggestService;

    const mockSuggestService = {
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SuggestController],
            providers: [
                {
                    provide: SuggestService,
                    useValue: mockSuggestService,
                },
            ],
        }).compile();

        controller = module.get<SuggestController>(SuggestController);
        suggestService = module.get<SuggestService>(SuggestService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create suggest', async () => {
            // Arrange
            const createSuggestDto: CreateSuggestDto = {
                series_id: 1,
                score: 8,
            };

            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const expectedSuggest: Suggest = {
                id: 1,
                series_id: 1,
                score: 8,
                comment: "good",
                user: {
                    username: "apinut",
                    role: Role.USER,
                    keycloakId: "apinut_id",
                    id: 1,
                    password: "1234",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                series: {
                    id: 1,
                    name: 'Test Series',
                    year: 2023,
                    suggests: [],
                    review: 'Test Description',
                    imageUrl: 'http://example.com/image.jpg',
                    rating: {
                        id: 3,
                        name: 'น 13+',
                        description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    user: {
                        id: 2,
                        username: 'donut',
                        password: '1234',
                        role: Role.USER,
                        keycloakId: 'keycloakID',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };


            const mockRequest = { user: loggedInUser };

            // set mock return
            mockSuggestService.create.mockResolvedValue(expectedSuggest);

            // call
            const result = await controller.create(createSuggestDto, mockRequest);

            // Assert
            expect(suggestService.create).toHaveBeenCalledWith(createSuggestDto, loggedInUser);
            expect(suggestService.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedSuggest);
        });
    });

    describe('update', () => {
        it('should update suggest', async () => {
            // Arrange
            const id = '1';
            const updateSuggestDto: UpdateSuggestDto = {
                score: 9,
            };

            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const expectedUpdatedSuggest: Suggest = {
                id: 1,
                series_id: 1,
                score: 9,
                comment: 'No comment!',
                user: {
                    id: 1,
                    username: 'apinut',
                    password: 'hashedPassword',
                    role: Role.USER,
                    keycloakId: 'test_id',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                series: {
                    id: 1,
                    name: 'Test Series',
                    year: 2023,
                    suggests: [],
                    review: 'Test Description',
                    imageUrl: 'http://example.com/image.jpg',
                    rating: {
                        id: 3,
                        name: 'น 13+',
                        description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    user: {
                        id: 2,
                        username: 'seriesowner',
                        password: 'hashedPassword',
                        role: Role.USER,
                        keycloakId: 'series_owner_id',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockRequest = { user: loggedInUser };

            // Setup mock return
            mockSuggestService.update.mockResolvedValue(expectedUpdatedSuggest);

            // Act
            const result = await controller.update(id, updateSuggestDto, mockRequest);

            // Assert
            expect(suggestService.update).toHaveBeenCalledWith(+id, updateSuggestDto, loggedInUser);
            expect(suggestService.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedUpdatedSuggest);
        });
    });

    describe('remove', () => {
        it('should remove suggest', async () => {
            // Arrange
            const idDto: IdDto = { id: 1 };
            const loggedInUser: LoggedInDto = {
                username: 'testuser',
                role: 'USER',
            };

            const mockRequest = { user: loggedInUser };

            // Setup mock return
            mockSuggestService.remove.mockResolvedValue(undefined);

            // Act
            const result = await controller.remove(idDto, mockRequest);

            // Assert
            expect(suggestService.remove).toHaveBeenCalledWith(idDto.id, loggedInUser);
            expect(suggestService.remove).toHaveBeenCalledTimes(1);
            expect(result).toBeUndefined();
        });

    });
});