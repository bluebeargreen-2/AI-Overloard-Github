import { Command } from "discord-akairo";
import { Message, GuildMember, MessageEmbed, ImageSize } from "discord.js";

export default class AvatarCommand extends Command {
    public constructor() {
        super("Avatar", {
            aliases: ["avatar"],
            category: "Public Commands",
            description: {
                content: "Grabs a users avatar from discord",
                usage: "avatar [Member]",
                examples: [
                    "avatar",
                    "avatar @someone"
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: "member",
                    type: "member",
                    match: "rest",
                    default: (msg: Message) => msg.member
                },
                {
                    id: "size",
                    type: (_: Message, str: string): null | Number => {
                        if (str && !isNaN(Number(str)) && [16, 32, 64, 128, 256, 512, 1024, 2048].includes(Number(str))) return Number(str);
                        return null;
                    },
                    match: "option",
                    flag: ["-size="], // /avatar @blue_bear_green#1645 -size=512
                    default: 2048
                }
            ]
        })
    }

    public exec(message: Message, { member, size }: { member: GuildMember, size: number}): Promise<Message> {
        return message.util.send(new MessageEmbed()
        .setTitle(`Avatar | ${member.user.tag}`)
        .setColor("RANDOM")
        .setImage(member.user.displayAvatarURL({ size: size as ImageSize }))
        );
    }
}