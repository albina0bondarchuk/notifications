import { SocketTokens } from "../entities/SocketTokens";
import { AppDataSource } from "../ormconfig";
import { log } from "../utils/logger";

export const SocketTokensRepository = AppDataSource.getRepository(SocketTokens);

export const createSocketTokenForUser = async (data) =>
  await SocketTokensRepository.save(data);

export const checkIsUserInChat = async (chatId) => {
  try {
    const result = await SocketTokensRepository.createQueryBuilder(
      "socket_tokens"
    )
      .innerJoinAndSelect("socket_tokens.user_id", "chat_user")
      .where("chat_user.chat_id = :chatId", { chatId })
      .getMany();
    return result;
  } catch (error) {
    log.error(error);
    throw error;
  }
















  
};

export const deleteSocketToken = async (socketId) =>
  SocketTokensRepository.delete({ id: socketId });
