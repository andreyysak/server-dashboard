import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateUserRoleDto {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.DRIVER,
    description: 'New role for user',
  })
  @IsNotEmpty({ message: 'Role can not be empty' })
  @IsEnum(UserRole, {
    message: `Role must be one of next values: ${Object.values(UserRole).join(', ')}`,
  })
  role: UserRole;
}
