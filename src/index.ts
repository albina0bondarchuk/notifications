import express from "express";
import http from "http";
import * as config from "../config.json";
import AWS from "aws-sdk";
import { Server } from "socket.io";
import { log } from "./utils/logger";
import cors from "cors";
import {
  createSocketTokenForUser,
  deleteSocketToken,
} from "./repositories/socketTokens";
import { AppDataSource } from "./ormconfig";
import { notificationsHandler } from "./helpers/notificationsHandler";

const queueUrl = config.sqsUrl;
const PORT = process.env.PORT ?? 4000;

AppDataSource.initialize().then(() => {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAXI75V4FARHJEXSGD",
    secretAccessKey: "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",
  });

  const sqs = new AWS.SQS();

  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 1,
    VisibilityTimeout: 10,
  };

  const processMessages = () => {
    sqs.receiveMessage(params, async (err, data) => {
      if (err) {
        log.error("Error receiving message from SQS:", err);
      } else if (data.Messages && data.Messages.length > 0) {
        const message = JSON.parse(data.Messages[0].Body);

        log.info("Received message from SQS:", message);
        console.log(message.chatId);

        await notificationsHandler(message, io);

        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };

        sqs.deleteMessage(deleteParams, (deleteErr) => {
          if (deleteErr) {
            log.error("Error deleting message from SQS:", deleteErr);
          } else {
            log.info("Message deleted from SQS");
          }
        });
      }

      processMessages();
    });
  };

  io.on("connection", async (socket) => {
    log.info("User connected");

    const socketId = socket.id;
    const userId = socket.handshake.query.userId;

    await createSocketTokenForUser({ id: socketId, userId });

    socket.on("disconnect", async () => {
      log.info("User disconnected");

      await deleteSocketToken(socketId);
    });

    socket.on("create", (room) => {
      log.info(`User joined ${room} room`);
      socket.join(room);
    });
  });

  server.listen(PORT, () => {
    log.debug(`Server is running on port ${PORT}`);
    processMessages();
  });
});
