import { Command } from "discord-akairo";
import { Message, GuildMember, User, MessageEmbed} from "discord.js";
import { Repository } from "typeorm";

import { Warns } from "../../models/Warns";

export default class InfractionsCommand extends Command {
    public constructor() {
        super("infractions", {
            aliases: ["infractions", "warns"],
            category: "Moderation Commands",
            description: {
                content: "Checks for warnings/Infractions",
                usage: "infractions [ Member ]",
                examples: [
                    "warns @blue_bear_green#1645",
                    "infractions @blue_bear_green#1645"
                ]
            },
            ratelimit: 3,
            userPermissions: ["VIEW_AUDIT_LOG"],
            args: [
                {
                    id: "member",
                    type: "member",
                    default: (msg: Message) => msg.member
                }
            ]
        });
    }

    public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message> {
        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        const warns: Warns[] = await warnRepo.find({ user: member.id, guild: message.guild.id});
        
        if (!warns.length) return message.util.reply("No Warnings Found");

        const infractions = await Promise.all(warns.map(async (v: Warns, i: number) => {
            const mod: User = await this.client.users.fetch(v.moderator).catch(() => null);
            if (mod) return {
                index: i + 1,
                moderator: mod.tag,
                reason: v.reason
            }

        }));

        return message.util.send(new MessageEmbed()
            .setAuthor(`Warnings | ${member.user.username}`, member.user.displayAvatarURL())
            .setColor("RANDOM")
            .setDescription(infractions.map(v => `\`#${v.index}\` | Moderator: *${v.moderator}*\nReason: *${v.reason}*\n`))
        );
    }
}