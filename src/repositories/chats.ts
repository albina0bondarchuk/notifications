import { ChatUser } from "../entities/ChatUser";
import { AppDataSource } from "../ormconfig";
import { log } from "../utils/logger";

export const ChatUserRepository = AppDataSource.getRepository(ChatUser);

export const findUsersForChat = async (chatId) => {
  try {
    const result = await ChatUserRepository.createQueryBuilder("chat_user")
      .innerJoin("chat_user.user", "users")

      .innerJoinAndSelect("users.user_id", "socket_tokens")
      .where("chat_user.chat_id = :chatId", { chatId })
      .getMany();
    return result;
  } catch (error) {
    log.error(error);
    throw error;
  }
};
