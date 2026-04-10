import apiClient from "@/lib/axios";
import { Ticket } from "@/lib/types";
import { useState } from "react";

export function useAssignTicket() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const assign = async (ticketId: string, assignedTo: string | null): Promise<Ticket | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.patch<{ success: boolean; data: Ticket }>(
                `/tickets/${ticketId}/assign`,
                { assigned_to: assignedTo }
            )
            return response.data.data;
        }
        catch {
            setError("Failed to assign ticket. Please try again.");
            return null;
        }
        finally {
            setLoading(false);
        }
    }

    return { assign, loading, error };
}