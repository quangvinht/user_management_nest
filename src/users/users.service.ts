import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async searchByUsername(username: string): Promise<User[]> {
    const userFilter = await this.userModel
      .find({
        username: { $regex: username, $options: 'i' },
      })
      .exec();
    if (userFilter.length === 0) {
      throw new NotFoundException('User not found');
    }
    return userFilter;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (user) {
      throw new ConflictException('User already exists!');
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async updateUser(
    username: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.username) {
      const checkDuplicatedUsername = await this.userModel.findOne({
        username: updateUserDto.username,
      });
      if (checkDuplicatedUsername) {
        throw new ConflictException('Username already exists!');
      }
    }

    return this.userModel
      .findOneAndUpdate({ username }, updateUserDto, { new: true })
      .exec();
  }

  async deleteUser(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.findOneAndDelete({ username }).exec();
  }
}
