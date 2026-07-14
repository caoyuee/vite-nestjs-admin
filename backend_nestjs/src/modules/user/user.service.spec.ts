import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Department } from '../../entities/department.entity';
import { User } from '../../entities/user.entity';
import { UserService } from './user.service';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createRepository = <T>(): MockRepository<T> => ({
  find: jest.fn(),
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
});

describe('UserService', () => {
  let userRepository: MockRepository<User>;
  let departmentRepository: MockRepository<Department>;
  let service: UserService;

  beforeEach(() => {
    userRepository = createRepository<User>();
    departmentRepository = createRepository<Department>();
    service = new UserService(
      userRepository as Repository<User>,
      departmentRepository as Repository<Department>,
    );
  });

  it('rejects creating a user when the department does not exist', async () => {
    userRepository.findOne!.mockResolvedValue(null);
    departmentRepository.findOne!.mockResolvedValue(null);

    await expect(
      service.createUser({
        name: '张三',
        username: 'zhangsan',
        password: '123456',
        departmentId: 99,
      }),
    ).rejects.toThrow(BadRequestException);

    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('saves departmentId when creating a user', async () => {
    userRepository.findOne!.mockResolvedValue(null);
    departmentRepository.findOne!.mockResolvedValue({ id: 1, name: '研发部' });
    userRepository.save!.mockResolvedValue({ id: 1 });

    await service.createUser({
      name: '李四',
      username: 'lisi',
      password: '123456',
      departmentId: 1,
    });

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '李四',
        username: 'lisi',
        departmentId: 1,
      }),
    );
  });

  it('returns departmentName in the user list', async () => {
    userRepository.findAndCount!.mockResolvedValue([
      [
        {
          id: 1,
          username: 'lisi',
          password: 'hashed',
          name: '李四',
          departmentId: 1,
        },
      ],
      1,
    ]);
    departmentRepository.find!.mockResolvedValue([{ id: 1, name: '研发部' }]);

    const result = await service.getUserList({ pageNum: 1, pageSize: 10 });

    expect(result.data.list).toEqual([
      expect.objectContaining({
        id: 1,
        username: 'lisi',
        name: '李四',
        departmentId: 1,
        departmentName: '研发部',
      }),
    ]);
    expect(result.data.list[0]).not.toHaveProperty('password');
  });
});
