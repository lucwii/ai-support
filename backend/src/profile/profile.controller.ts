import {
    Controller,
    Get,
    Delete,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ProfileService } from "./profile.service";
import { AuthGuard } from "../auth/auth.guard";
import { GetUser } from "../auth/get-user.decorator";
import type { JwtPayload } from "../auth/types/jwt-payload.types";

@Controller("profile")
@UseGuards(AuthGuard)
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get("me")
    async getProfile(@GetUser() user: JwtPayload) {
        const data = await this.profileService.getProfile(user.sub);
        return { success: true, data };
    }

    @Post("me/avatar")
    @UseInterceptors(FileInterceptor("file"))
    async uploadAvatar(
        @GetUser() user: JwtPayload,
        @UploadedFile() file: Express.Multer.File
    ) {
        const data = await this.profileService.uploadAvatar(user.sub, file.buffer, file.mimetype);
        return { success: true, data };
    }

    @Delete("me")
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAccount(@GetUser() user: JwtPayload) {
        await this.profileService.deleteAccount(user.sub);
    }
}
