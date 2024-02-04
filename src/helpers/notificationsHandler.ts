import { NotificationsTypes } from "../constants/notifications";
import { findUsersForChat } from "../repositories/socketTokens";

export const notificationsHandler = async (notification, io) => {
  switch (notification.type) {
    case NotificationsTypes.CREATE_MESSAGE: {
      io.to(notification.chatId).emit("sendMessage", {
        ...notification.message,
      });

      const usersToSendNotification = await findUsersForChat(
        notification.chatId, 
        notification.message.creatorId,
      );

      usersToSendNotification.map((user) => {
        io.to(user.id).emit("notification", {
          ...notification.message,
        });
      });
    }
  }
};
