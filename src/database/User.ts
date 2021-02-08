import { Model, ModelObject } from 'objection';
export class User extends Model {
    fireBaseToken!: string;

    static tableName = "User";
    static idColumn = "fireBaseToken";
}

export type UserObject = ModelObject<User>