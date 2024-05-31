import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ObjectId } from 'mongoose';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get(':id')
  async getUser(@Param('id') _id: ObjectId) {
    return this.usersService.getSingleUser(_id);
  }

  @Get('username/:username')
  async getSingleUserByUsername(@Param('username') username: string) {
    return this.usersService.getSingleUserByUsername(username);
  }

  @Get('search')
  async searchByUsername(@Query('username') username: string) {
    return this.usersService.searchByUsername(username);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  async updateUser(
    @Query('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(username, updateUserDto);
  }

  @Delete()
  async deleteUser(@Query('username') username: string) {
    return this.usersService.deleteUser(username);
  }
}
