import { Model, ModelObject } from 'objection';
export class User extends Model {
    fireBaseToken!: string;

    static tableName = "User";
}

export type UserObject = ModelObject<User>