import { Listener } from "discord-akairo";
import { TextChannel, Message} from "discord.js";
import { Repository } from "typeorm";
import { Giveaways } from "../../models/Giveaways";

import GiveawayManager from "../../structures/giveaways/GiveawaysManager";

export default class ReadyListener extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "client"
        });
    }

    public exec(): void {
        const giveawayRepo: Repository<Giveaways> = this.client.db.getRepository(Giveaways);

        console.log(`${this.client.user.tag} is now online and ready!`);

        setInterval(async () => {
            const giveaways: Giveaways[] = await giveawayRepo.find();
            giveaways.filter(g => g.end <= Date.now()).map(async g => {
                const msg: Message = await (this.client.channels.cache.get(g.channel) as TextChannel).messages.fetch()
                    .catch(() => null);

                if (!msg) return giveawayRepo.delete(g);

                GiveawayManager.end(giveawayRepo, msg);
            });
        }, 3e5);
    }
}