import { Model, ModelObject } from 'objection';
export class Chat extends Model {
    chatId!: string;

    static tableName = "Chats";
    static idColumn = "chatId";
}

export type ChatObject = ModelObject<Chat>