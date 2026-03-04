import * as z from "zod";

export const serverSchema = z.object({
    name: z.string().min(3, "Server name must be at least 3 characters.").max(50, "Server name is too long."),
    gameType: z.string().min(1, "Please select a game type."),
    serverIP: z.string().min(3, "Valid IP or hostname is required."),
    port: z.number().int().min(1).max(65535).optional().or(z.nan()),

    description: z.string().min(50, "Description must be at least 50 characters."),
    tags: z.array(z.string()).min(1, "At least one tag is required.").max(5, "Maximum of 5 tags allowed."),

    bannerImage: z.string().url().optional().or(z.literal("")),
    logoImage: z.string().url().optional().or(z.literal("")),

    discordURL: z.string().url("Must be a valid Discord URL").optional().or(z.literal("")),
    websiteURL: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ServerFormData = z.infer<typeof serverSchema>;
