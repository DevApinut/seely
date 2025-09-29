import { Test, TestingModule } from '@nestjs/testing';
import { SeriesService } from './series.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Series } from './entities/series.entity';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@app/users/entities/user.entity';
import { PaginateQuery } from 'nestjs-paginate';

describe('SeriesService', () => {
    let service: SeriesService;
    let repository: Repository<Series>;

    const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
        getRawOne: jest.fn(),
    };

    const mockRepository = {
        save: jest.fn(),
        findOneByOrFail: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn(() => mockQueryBuilder),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeriesService,
                {
                    provide: getRepositoryToken(Series),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<SeriesService>(SeriesService);
        repository = module.get<Repository<Series>>(getRepositoryToken(Series));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new series', async () => {
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

            mockRepository.save.mockResolvedValue(expectedSeries);

            // Act
            const result = await service.create(createSeriesDto, loggedInUser);

            // Assert
            expect(mockRepository.save).toHaveBeenCalledWith({
                ...createSeriesDto,
                user: { username: loggedInUser.username },
            });
            expect(result).toEqual(expectedSeries);
        });
    });

    describe('findOne', () => {
        it('should return', async () => {
            // Arrange
            const id = 1;
            const loggedInUser: LoggedInDto = {
                username: 'apinut',
                role: 'USER',
            };

            const mockSeries: Series = {
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

            const mockStats = {
                totalSuggests: 5,
                averageScore: 8.5,
            };

            mockQueryBuilder.getOne.mockResolvedValue(mockSeries);
            mockQueryBuilder.getRawOne.mockResolvedValue({
                totalSuggests: '5',
                averageScore: '8.5',
            });

            // Act
            const result = await service.findOne(id, loggedInUser);

            // Assert
            expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('series');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith('series.id = :id', { id });
            expect(result).toEqual({
                ...mockSeries,
                totalSuggests: mockStats.totalSuggests,
                averageScore: mockStats.averageScore,
            });
        });
    });

    describe('update', () => {
        it('should update a series successfully', async () => {
            // Arrange
            const id = 1;
            const updateSeriesDto: UpdateSeriesDto = {
                name: 'Updated Series Name',
                review: 'Updated review',
            };

            const loggedInUser: LoggedInDto = {
                username: 'testuser',
                role: 'USER',
            };

            const existingSeries: Series = {
                id: 1,
                name: 'Test Series',
                year: 2023,
                suggests: [],
                review: 'Original review',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 1,
                    name: 'PG-13',
                    description: 'Parental Guidance',
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

            const updatedSeries = {
                ...existingSeries,
                ...updateSeriesDto,
            };

            mockRepository.findOneByOrFail.mockResolvedValue(existingSeries);
            mockRepository.save.mockResolvedValue(updatedSeries);

            // Act
            const result = await service.update(id, updateSeriesDto, loggedInUser);

            // Assert
            expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({
                id,
                user: { username: loggedInUser.username },
            });
            expect(mockRepository.save).toHaveBeenCalledWith({
                id,
                ...updateSeriesDto,
            });
            expect(result).toEqual(updatedSeries);
        });
    });

    describe('remove', () => {
        it('should remove a series successfully', async () => {
            // Arrange
            const id = 1;
            const loggedInUser: LoggedInDto = {
                username: 'testuser',
                role: 'USER',
            };

            const existingSeries: Series = {
                id: 1,
                name: 'Test Series',
                year: 2023,
                suggests: [],
                review: 'Test review',
                imageUrl: 'http://example.com/image.jpg',
                rating: {
                    id: 1,
                    name: 'PG-13',
                    description: 'Parental Guidance',
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

            const deleteResult = { affected: 1 };

            mockRepository.findOneByOrFail.mockResolvedValue(existingSeries);
            mockRepository.delete.mockResolvedValue(deleteResult);

            // Act
            const result = await service.remove(id, loggedInUser);

            // Assert
            expect(mockRepository.findOneByOrFail).toHaveBeenCalledWith({
                id,
                user: { username: loggedInUser.username },
            });
            expect(mockRepository.delete).toHaveBeenCalledWith({ id });
            expect(result).toEqual(deleteResult);
        });
    });
});