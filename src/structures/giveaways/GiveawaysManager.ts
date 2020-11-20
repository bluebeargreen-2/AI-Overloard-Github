import { Message, MessageEmbed, MessageReaction, User} from "discord.js";
import { Repository } from "typeorm";
import { Giveaways } from "../../models/Giveaways";

export default {
    async end(giveawayRepo: Repository<Giveaways>, msg: Message) {
        await msg.fetch();
        giveawayRepo.delete({ message: msg.id});

        const reaction: MessageReaction = await msg.reactions.cache.filter(r => r.emoji.name === "🎉").first().fetch()
        await reaction.users.fetch();
        const winner: User = reaction.users.cache.filter(w => !w.bot).random();

        const embed: MessageEmbed = msg.embeds[0];
        embed.setFooter("Giveaway Ended");
        embed.setColor("#f44336")
        embed.addField("Winner:", winner ? `${winner} (${winner.tag})` : "No winners")
        msg.edit(embed);
    }
}