import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        private readonly supabaseService: SupabaseService
    ){}

    
    async getProfile(userId: string) {
        this.logger.log(`Fetching profile for user: ${userId}`);

        const { data: authData, error: authError } =
            await this.supabaseService.db.auth.admin.getUserById(userId);

        if (authError || !authData.user) {
            this.logger.error(`User not found: ${authError?.message}`);
            throw new NotFoundException("User not found");
        }

        const user = authData.user;

        const { count: ticketCount } = await this.supabaseService.db
            .from("tickets")
            .select("id", { count: "exact", head: true })
            .eq("created_by", userId);

        return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatar_url: user.user_metadata?.avatar_url ?? null,
            provider: user.app_metadata?.provider ?? "email",
            created_at: user.created_at,
            ticket_count: ticketCount ?? 0,
        };
    }

    async deleteAccount(userId: string) {
        this.logger.log(`Deleting account for user: ${userId}`);

        await this.supabaseService.db
            .from("organization_members")
            .delete()
            .eq("user_id", userId);

        const { error } = await this.supabaseService.db.auth.admin.deleteUser(userId);

        if (error) {
            this.logger.error(`Failed to delete user: ${error.message}`);
            throw new Error(`Failed to delete account: ${error.message}`);
        }

        this.logger.log(`Account deleted: ${userId}`);

        return { deleted: true };
    }


    async uploadAvatar(userId: string, file: Buffer, mimetype: string) {
        this.logger.log(`Uploading avatar for user: ${userId}`);

        const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
        if (!ALLOWED_TYPES.includes(mimetype)) {
            throw new BadRequestException("Only JPEG, PNG and WebP images are allowed");
        }

        const ext = mimetype.split("/")[1];
        const path = `${userId}/avatar.${ext}`;

        const { error: uploadError } = await this.supabaseService.db.storage
            .from("avatars")
            .upload(path, file, {
                contentType: mimetype,
                upsert: true,
            });

        if (uploadError) {
            this.logger.error(`Storage upload failed: ${uploadError.message}`);
            throw new Error(`Failed to upload avatar: ${uploadError.message}`);
        }

        const { data: urlData } = this.supabaseService.db.storage
            .from("avatars")
            .getPublicUrl(path);

        const avatarUrl = urlData.publicUrl;

        const { error: updateError } = await this.supabaseService.db.auth.admin.updateUserById(
            userId,
            { user_metadata: { avatar_url: avatarUrl } }
        );

        if (updateError) {
            this.logger.error(`Failed to update user metadata: ${updateError.message}`);
            throw new Error(`Failed to save avatar URL: ${updateError.message}`);
        }

        this.logger.log(`Avatar uploaded for user: ${userId}`);

        return { avatar_url: avatarUrl };
    }
}