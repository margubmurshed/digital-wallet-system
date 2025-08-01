import { QueryBuilder } from "../../utils/QueryBuilder";
import { Transaction } from "./transaction.model";

const getMyTransactions = async (userId: string, query: Record<string, string>) => {
    const findQuery = Transaction.find({
        $or: [
            { from: userId },
            { to: userId }
        ]
    })
    const queryBuilder = new QueryBuilder(findQuery, query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate()

    const [data, meta] = await Promise.all([
        queryBuilder.build().populate("from", "name phone").populate("to", "name phone"),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

const getAllTransactions = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Transaction.find(), query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate();

    const [data, meta] = await Promise.all([
        queryBuilder.build(),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

export const TransactionService = {
    getMyTransactions,
    getAllTransactions
}