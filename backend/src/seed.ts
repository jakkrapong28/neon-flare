import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const email = 'admin';
    const password = '1234';

    const existingUser = await usersService.findOneByEmail(email);
    if (existingUser) {
        console.log('User already exists');
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await usersService.create({
            email,
            password: hashedPassword,
            name: 'Lucifer Admin', // Added required field
            username: 'Admin',
            roles: ['admin'],
        });
        console.log('Admin user created successfully');
    }

    await app.close();
}
bootstrap();
