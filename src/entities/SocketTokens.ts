import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class SocketTokens {
  @PrimaryColumn("varchar", { name: "id" })
  id: string;

  @Column({ name: "user_id" })
  userId: number;
}
