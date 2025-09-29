import { Test, TestingModule } from '@nestjs/testing';
import { SuggestService } from './suggest.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suggest } from './entities/suggest.entity';
import { Series } from '@app/series/entities/series.entity';
import { CreateSuggestDto } from './dto/create-suggest.dto';
import { UpdateSuggestDto } from './dto/update-suggest.dto';
import { LoggedInDto } from '@app/auth/dto/logged-in.dto';
import { NotFoundException } from '@nestjs/common';
import { Role } from '@app/users/entities/user.entity';

describe('SuggestService', () => {
    let service: SuggestService;
    let suggestRepository: Repository<Suggest>;
    let seriesRepository: Repository<Series>;

    const mockSuggestRepository = {
        findOne: jest.fn(),
        findOneByOrFail: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
    };

    const mockSeriesRepository = {
        findOne: jest.fn(),
        findOneOrFail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SuggestService,
                {
                    provide: getRepositoryToken(Suggest),
                    useValue: mockSuggestRepository,
                },
                {
                    provide: getRepositoryToken(Series),
                    useValue: mockSeriesRepository,
                },
            ],
        }).compile();

        service = module.get<SuggestService>(SuggestService);
        suggestRepository = module.get<Repository<Suggest>>(
            getRepositoryToken(Suggest),
        );
        seriesRepository = module.get<Repository<Series>>(
            getRepositoryToken(Series),
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        const createSuggestDto: CreateSuggestDto = {
            series_id: 1,
            score: 8,
        };

        const loggedInUser: LoggedInDto = {
            username: 'apinut',
            role: 'USER',
        };

        const mockSeries = {
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
                username: 'apiut',
                password: 'hashedPassword',
                role: Role.USER,
                keycloakId: '1234',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should create a new suggest when user has not suggested before', async () => {
            // Arrange
            const expectedSuggest = {
                id: 1,
                series_id: 1,
                score: 8,
                user: { username: 'apinut' },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockSeriesRepository.findOne.mockResolvedValue(null); 
            mockSeriesRepository.findOneOrFail.mockResolvedValue(mockSeries);
            mockSuggestRepository.findOne.mockResolvedValue(null); 
            mockSuggestRepository.save.mockResolvedValue(expectedSuggest);
            
            const result = await service.create(createSuggestDto, loggedInUser);
           
            expect(mockSeriesRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: createSuggestDto.series_id,
                    user: { username: loggedInUser.username },
                },
            });
            expect(mockSeriesRepository.findOneOrFail).toHaveBeenCalledWith({
                where: { id: createSuggestDto.series_id },
            });
            expect(mockSuggestRepository.findOne).toHaveBeenCalledWith({
                where: {
                    series_id: createSuggestDto.series_id,
                    user: { username: loggedInUser.username },
                },
            });
            expect(mockSuggestRepository.save).toHaveBeenCalledWith({
                ...createSuggestDto,
                user: { username: loggedInUser.username },
            });
            expect(result).toEqual(expectedSuggest);
        });
        
    });

    describe('update', () => {
        const updateSuggestDto: UpdateSuggestDto = {
            score: 9,
        };

        const loggedInUser: LoggedInDto = {
            username: 'apinut',
            role: 'USER',
        };

        it('should update a suggest successfully', async () => {
            // Arrange
            const id = 1;
            const existingSuggest = {
                id: 1,
                series_id: 1,
                score: 8,
                user: { username: 'apinut' },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedSuggest = {
                id: 1,
                series_id: 1,
                score: 9,
                username: 'apinut',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockSuggestRepository.findOneByOrFail.mockResolvedValue(existingSuggest);
            mockSuggestRepository.save.mockResolvedValue(updatedSuggest);

            // Act
            const result = await service.update(id, updateSuggestDto, loggedInUser);

            // Assert
            expect(mockSuggestRepository.findOneByOrFail).toHaveBeenCalledWith({
                series_id: id,
                user: { username: loggedInUser.username },
            });
            expect(mockSuggestRepository.save).toHaveBeenCalledWith({
                id: existingSuggest.id,
                ...updateSuggestDto,
                username: loggedInUser.username,
            });
            expect(result).toEqual(updatedSuggest);
        });       
    });

    describe('remove', () => {
        const loggedInUser: LoggedInDto = {
            username: 'testuser',
            role: 'USER',
        };

        it('should remove a suggest successfully', async () => {
            // Arrange
            const id = 1;
            const existingSuggest = {
                id: 1,
                series_id: 1,
                score: 8,
                user: { username: 'testuser' },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockSuggestRepository.findOneByOrFail.mockResolvedValue(existingSuggest);
            mockSuggestRepository.delete.mockResolvedValue({ affected: 1 });

            // Act
            const result = await service.remove(id, loggedInUser);

            // Assert
            expect(mockSuggestRepository.findOneByOrFail).toHaveBeenCalledWith({
                series_id: id,
                user: { username: loggedInUser.username },
            });
            expect(mockSuggestRepository.delete).toHaveBeenCalledWith({ id: existingSuggest.id });
            expect(result).toBe('delete success');
        });
    });
});