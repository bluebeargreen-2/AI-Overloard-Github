import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import ms from "ms";

import { Repository } from "typeorm";
import { Giveaways } from "../../models/Giveaways";

import GiveawayManager from "../../structures/giveaways/GiveawaysManager"

export default class GiveawayCommand extends Command {
    public constructor() {
        super("giveaway", {
            aliases: ["giveaway"],
            category: "Public Commands",
            description: {
                content: "Start a giveaway",
                usage: "giveaway [time] [item]",
                examples: [
                    "giveaway 1d Vip rank"
                ]
            },
            ratelimit: 3,
            args: [
                {
                    id: "time",
                    type: (msg: Message, str: string) => {
                        return Number(ms(str));
                    },
                    prompt: {
                        start: (msg: Message) => `${msg.author}, You need a time value!`,
                        retry: (msg: Message) => `${msg.author}, You need to provide a valid time!`
                    }
                },
                {
                    id: "item",
                    type: "string",
                    match: "rest",
                    prompt: {
                        start: (msg: Message) => `${msg.author}, You must provide a itme to giveaway!`
                    }
                }
            ]
        });
    }

    public async exec(message: Message, { time, item }: { time: number, item: string }): Promise<any> {
        const giveawayRepo: Repository<Giveaways> = this.client.db.getRepository(Giveaways);
        const end: number = Date.now() + time;

        const msg: Message = await message.channel.send(new MessageEmbed()
            .setAuthor(`Giveaway | ${item}`)
            .setColor("#4caf50")
            .setDescription(`${message.author} is giving away **${item}**!`)
            .setFooter("Giveaway Ends")
            .setTimestamp(end)
        );
        msg.react("🎉")

        giveawayRepo.insert({
            channel: msg.channel.id,
            message: msg.id,
            end: end
        });

        setTimeout(() => {

    GiveawayManager.end(giveawayRepo, msg);
        }, time);
    }
}