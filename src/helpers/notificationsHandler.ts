import { NotificationsTypes } from "../constants/notifications";
import { findUsersForChat } from "../repositories/chats";
import { checkIsUserInChat } from "../repositories/socketTokens";

export const notificationsHandler = async (notification, io) => {
  switch (notification.type) {
    case NotificationsTypes.CREATE_MESSAGE: {
      io.to(notification.chatId).emit("sendMessage", {
        ...notification.message,
      });

      const usersToSendNotification = await findUsersForChat(
        notification.chatId
      );
      console.log(usersToSendNotification);

      // io.to().emit("notification", {
      //   ...notification.message,
      // });
    }
  }
};
