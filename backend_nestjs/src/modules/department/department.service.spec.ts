import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { DepartmentService } from './department.service';

type MockRepository = Partial<Record<keyof Repository<Department>, jest.Mock>>;

const createRepository = (): MockRepository => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
});

describe('DepartmentService', () => {
  let repository: MockRepository;
  let service: DepartmentService;

  beforeEach(() => {
    repository = createRepository();
    service = new DepartmentService(repository as Repository<Department>);
  });

  it('returns departments as a tree ordered by sort', async () => {
    repository.findAndCount!.mockResolvedValue([
      [
        { id: 2, parentId: 1, name: '研发一组', sort: 2 },
        { id: 1, parentId: 0, name: '研发部', sort: 1 },
        { id: 3, parentId: 1, name: '研发二组', sort: 1 },
      ],
      3,
    ]);

    const result = await service.getDepartmentList({
      pageNum: 1,
      pageSize: 10,
    });

    expect(result.data.list).toEqual([
      {
        id: 1,
        parentId: 0,
        name: '研发部',
        sort: 1,
        children: [
          { id: 3, parentId: 1, name: '研发二组', sort: 1 },
          { id: 2, parentId: 1, name: '研发一组', sort: 2 },
        ],
      },
    ]);
    expect(result.data.total).toBe(3);
  });

  it('rejects deleting a department that still has children', async () => {
    repository
      .findOne!.mockResolvedValueOnce({ id: 1, name: '研发部' })
      .mockResolvedValueOnce({ id: 2, parentId: 1, name: '研发一组' });

    await expect(service.deleteDepartment(1)).rejects.toThrow(
      BadRequestException,
    );
    expect(repository.softDelete).not.toHaveBeenCalled();
  });
});
