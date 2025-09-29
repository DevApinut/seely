import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from './series.controller';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { Role } from '@app/users/entities/user.entity';
import { PaginateQuery } from 'nestjs-paginate';

describe('SeriesController', () => {
    let controller: SeriesController;
    let seriesService: SeriesService;

    const mockSeriesService = {
        create: jest.fn(),
        search: jest.fn(),
        Myseries: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeriesController],
            providers: [
                {
                    provide: SeriesService,
                    useValue: mockSeriesService,
                },
            ],
        }).compile();

        controller = module.get<SeriesController>(SeriesController);
        seriesService = module.get<SeriesService>(SeriesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create series', async () => {
            // Arrange
            const createSeriesDto: CreateSeriesDto = {
                name: 'Test Series',
                year: 2023,
                review: 'Great series to watch',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 1,
                },
            };

            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const expectedSeries: Series = {
                id: 1,
                name: 'Test Series',
                year: 2023,
                suggests: [],
                review: 'Great series to watch',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 3,
                    name: 'น 13+',
                    description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                user: {
                    id: 1,
                    username: 'apinut',
                    password: '1234',
                    role: Role.USER,
                    keycloakId: '1234',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockRequest = { user: loggedInUser };

            // Setup mock return
            mockSeriesService.create.mockResolvedValue(expectedSeries);

            // Act
            const result = await controller.create(createSeriesDto, mockRequest);

            // Assert
            expect(seriesService.create).toHaveBeenCalledWith(createSeriesDto, loggedInUser);
            expect(seriesService.create).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedSeries);
        });

    });

    describe('search', () => {
        it('should return paginated series for logged in user', async () => {
            // Arrange
            const query: PaginateQuery = {
                page: 1,
                limit: 10,
                search: "a",
                path: '/series',
            };

            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        name: 'Test Series',
                        year: 2023,
                        review: 'Great series',
                        imageUrl: 'http://example.com/image.jpg',
                    },
                ],
            };

            const mockRequest = { user: loggedInUser };

            mockSeriesService.search.mockResolvedValue(expectedResult);

            // Act
            const result = await controller.search(query, mockRequest);

            // Assert
            expect(seriesService.search).toHaveBeenCalledWith(query, loggedInUser);
            expect(seriesService.search).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
        
    });

    describe('Myseries', () => {
        it('should return user own series', async () => {
            // Arrange
            const query: PaginateQuery = {
                page: 1,
                limit: 10,
                path: '/series/myserie',
            };

            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const expectedResult = {
                data: [
                    {
                        id: 1,
                        name: 'My Series',
                        year: 2023,
                        review: 'My own series',
                        imageUrl: 'http://example.com/image.jpg',
                    },
                ],               
            };

            const mockRequest = { user: loggedInUser };

            mockSeriesService.Myseries.mockResolvedValue(expectedResult);

            // Act
            const result = await controller.Myseries(query, mockRequest);

            // Assert
            expect(seriesService.Myseries).toHaveBeenCalledWith(query, loggedInUser);
            expect(seriesService.Myseries).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOne', () => {
        it('ahould find 1 serie', async () => {
            // Arrange
            const id = '1';
            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };
            const expectedSeries: Series = {
                id: 1,
                name: 'Test Series',
                year: 2023,
                suggests: [],
                review: 'Great series to watch',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 3,
                    name: 'น 13+',
                    description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                user: {
                    id: 1,
                    username: 'apinut',
                    password: '1234',
                    role: Role.USER,
                    keycloakId: '1234',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockRequest = { user: loggedInUser };

            mockSeriesService.findOne.mockResolvedValue(expectedSeries);

            // Act
            const result = await controller.findOne(id, mockRequest);

            // Assert
            expect(seriesService.findOne).toHaveBeenCalledWith(+id, loggedInUser);
            expect(seriesService.findOne).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedSeries);
        });        
    });

    describe('update', () => {
        it('should update a series', async () => {
            // Arrange
            const id = '1';
            const updateSeriesDto: UpdateSeriesDto = {
                name: 'Updated Series Name',
                review: 'Updated review',
            };

            const loggedInUser: LoggedInDto = {
                username: 'testuser',
                role: 'USER',
            };

            const expectedUpdatedSeries: Series = {
                id: 1,
                name: 'Updated Series Name',
                year: 2023,
                suggests: [],
                review: 'Updated review',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 3,
                    name: 'น 13+',
                    description: 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                user: {
                    id: 1,
                    username: 'testuser',
                    password: 'hashedPassword',
                    role: Role.USER,
                    keycloakId: 'test_id',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const mockRequest = { user: loggedInUser };

            mockSeriesService.update.mockResolvedValue(expectedUpdatedSeries);

            // Act
            const result = await controller.update(id, updateSeriesDto, mockRequest);

            // Assert
            expect(seriesService.update).toHaveBeenCalledWith(+id, updateSeriesDto, loggedInUser);
            expect(seriesService.update).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedUpdatedSeries);
        });        
    });

    describe('remove', () => {
        it('should remove a series', async () => {
            // Arrange
            const id = '1';
            const loggedInUser: LoggedInDto = {
                username: 'testuser',
                role: 'USER',
            };

            const mockRequest = { user: loggedInUser };

            mockSeriesService.remove.mockResolvedValue('Series deleted successfully');

            // Act
            const result = await controller.remove(id, mockRequest);

            // Assert
            expect(seriesService.remove).toHaveBeenCalledWith(+id, loggedInUser);
            expect(seriesService.remove).toHaveBeenCalledTimes(1);
            expect(result).toBe('Series deleted successfully');
        });
    });
});