import { QueryBuilder } from "../../utils/QueryBuilder";
import { Transaction } from "./transaction.model";

const getMyTransactions = async (userId: string, query: Record<string, string>) => {
    const filter = {
        $or: [
            { from: userId },
            { to: userId }
        ]
    }
    
    const findQuery = Transaction.find(filter)
    const queryBuilder = new QueryBuilder(findQuery, query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate()

    const [data] = await Promise.all([
        queryBuilder.build().populate("from", "name phone").populate("to", "name phone")
    ])

    const totalDocuments = await Transaction.countDocuments({...filter, ...queryBuilder.conditions});
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const totalPages = Math.ceil(totalDocuments / limit);


    return {
        data, meta: {
            total: totalDocuments,
            page,
            limit,
            totalPages
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllTransactions = async (query: Record<any, any>) => {
    const {minAmount, maxAmount} = query;
    if(minAmount || maxAmount){
        query.amount = {};
    }
    if(minAmount){
        query.amount = {...query.amount, $gte: Number(minAmount)}
    }
    if(maxAmount){
        query.amount = {...query.amount, $lte: Number(maxAmount)}
    }
    
    const queryBuilder = new QueryBuilder(Transaction.find(), query);
    queryBuilder
        .filter()
        .fields()
        .sort()
        .paginate();

    const [data, meta] = await Promise.all([
        queryBuilder.build().populate("from", "name phone").populate("to", "name phone"),
        queryBuilder.getMetaData()
    ])

    return { data, meta }
}

export const TransactionService = {
    getMyTransactions,
    getAllTransactions
}