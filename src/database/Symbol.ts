import { Model, ModelObject } from 'objection';
export class Symbol extends Model {
    symbol!: string;
    baseAsset!: string;
    quoteAsset!: string;

    static tableName = "Symbol";
    static idColumn = "symbol";
}

export type SymbolObject = ModelObject<Symbol>