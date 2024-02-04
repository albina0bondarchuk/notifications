import { ChatUser } from "../entities/ChatUser";
import { SocketTokens } from "../entities/SocketTokens";
import { Users } from "../entities/Users";
import { AppDataSource } from "../ormconfig";
import { log } from "../utils/logger";

export const SocketTokensRepository = AppDataSource.getRepository(SocketTokens);
export const UsersRepository = AppDataSource.getRepository(Users);
export const ChatUserRepository = AppDataSource.getRepository(ChatUser);

export const createSocketTokenForUser = async (data) =>
  await SocketTokensRepository.save(data);

export const deleteSocketToken = async (socketId) =>
  SocketTokensRepository.delete({ id: socketId });

export const findUsersForChat = async (chatId, creatorId) => {
  try {
    const chatUsers = await ChatUserRepository.createQueryBuilder("chat_user")
      .innerJoinAndSelect("chat_user.user", "users")
      .where("chat_user.chat_id = :chatId", { chatId })
      .andWhere("users.id <> :creatorId", { creatorId })
      .getMany();

    const result = await SocketTokensRepository.createQueryBuilder(
      "socket_tokens"
    )
      .where("user_id IN (:...chatUsers)", {
        chatUsers: chatUsers.map((chatUser) => chatUser.user.id),
      })
      .getMany();

    return result;
  } catch (error) {
    log.error(error);
    throw error;
  }
};
