import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateDepartmentDto } from './create-department.dto';

describe('CreateDepartmentDto', () => {
  it('accepts empty optional contact fields from frontend forms', async () => {
    const dto = plainToInstance(CreateDepartmentDto, {
      parentId: 0,
      name: '研发部',
      code: 'RD',
      sort: 0,
      leader: '',
      phone: '',
      email: '',
      status: true,
      remark: '',
    });

    const errors = await validate(dto);

    expect(errors).toEqual([]);
  });
});
