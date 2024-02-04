import "reflect-metadata";
import { DataSource } from "typeorm";
import { SocketTokens } from "./entities/SocketTokens";
import { Chats } from "./entities/Chats";
import { ChatUser } from "./entities/ChatUser";
import { Users } from "./entities/Users";
import { UserContacts } from "./entities/UserContacts";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1111",
  database: "messenger",
  entities: [SocketTokens, Chats, ChatUser, Users, UserContacts],
  synchronize: true,
  logging: false,
});
