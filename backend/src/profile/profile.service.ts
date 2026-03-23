import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(
        private readonly supabaseService: SupabaseService
    ){}

    /**
     * Vraca enriched profil korisnika.
     *
     * Zasto koristimo admin.getUserById umesto auth.getUser()?
     * auth.getUser() radi samo sa JWT tokenom korisnika (client-side).
     * Na backendu imamo userId iz JWT middleware-a, pa koristimo admin API
     * da dohvatimo pune podatke korisnika ukljucujuci created_at i user_metadata.
     */
    async getProfile(userId: string) {
        this.logger.log(`Fetching profile for user: ${userId}`);

        // Dohvati korisnika iz Supabase Auth
        const { data: authData, error: authError } =
            await this.supabaseService.db.auth.admin.getUserById(userId);

        if (authError || !authData.user) {
            this.logger.error(`User not found: ${authError?.message}`);
            throw new NotFoundException("User not found");
        }

        const user = authData.user;

        // Prebrojimo tikete koje je korisnik kreirao
        // count: 'exact' vraca tacan broj bez fetchovanja svih redova
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

    /**
     * Brise nalog korisnika.
     *
     * Zasto mora kroz backend?
     * Supabase admin.deleteUser() zahteva SERVICE_ROLE_KEY koji ne smemo
     * da izlazemo na frontendu. Jedino backend ima pristup ovom kljucu.
     *
     * Redosled operacija je bitan — brisemo korisnicke podatke pre nego sto
     * izbrisemo auth nalog, jer nakon toga vise ne mozemo da matchujemo po userId.
     */
    async deleteAccount(userId: string) {
        this.logger.log(`Deleting account for user: ${userId}`);

        // Korak 1: Ukloni korisnika iz organization_members
        // Ovo ne baca error ako red ne postoji (.eq filteri su dovoljni)
        await this.supabaseService.db
            .from("organization_members")
            .delete()
            .eq("user_id", userId);

        // Korak 2: Obrisi auth nalog — nakon ovoga userId vise ne postoji
        const { error } = await this.supabaseService.db.auth.admin.deleteUser(userId);

        if (error) {
            this.logger.error(`Failed to delete user: ${error.message}`);
            throw new Error(`Failed to delete account: ${error.message}`);
        }

        this.logger.log(`Account deleted: ${userId}`);

        return { deleted: true };
    }
}