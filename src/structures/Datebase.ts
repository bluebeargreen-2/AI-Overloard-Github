import { ConnectionManager, Entity } from "typeorm";
import { Warns } from "../models/Warns";
import { dbName } from "../Config";

import { Giveaways } from "../models/Giveaways"

const connectionManager: ConnectionManager = new ConnectionManager();
connectionManager.create({
    name: dbName,
    type: "sqlite",
    database: "./db.sqlite",
    entities: [
        Warns,
        Giveaways
    ]
});

export default connectionManager; 