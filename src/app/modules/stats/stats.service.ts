/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../user/user.model";
import { Transaction } from "../transaction/transaction.model";
import { toZonedTime } from "date-fns-tz";
import { format, startOfDay, subDays } from "date-fns";

const getStats = async () => {
    const today = new Date();
    const timeZone = "Asia/Dhaka";

    const localDate = startOfDay(subDays(today, 13))
    const startDate = toZonedTime(localDate, timeZone);

    const lastSevenDays = Array.from({ length: 7 }).map((_, i) => format(subDays(today, 6 - i), "dd MMM"))

    const usersRaw = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                role: "USER"
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Dhaka" } },
                count: { $sum: 1 }
            }
        }
    ])

    const agentsRaw = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                role: "AGENT"
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Dhaka" } },
                count: { $sum: 1 }
            }
        }
    ])

    const transactionsRaw = await Transaction.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "Asia/Dhaka" } },
                count: { $sum: 1 },
                totalAmount: { $sum: "$amount" }
            }
        }
    ])

    const fillMissingDays = (raw: any[]) => {
        const lookup = raw.reduce((prev, current) => {
            const key = format(new Date(current._id), "dd MMM");
            prev[key] = current;

            return prev;
        }, {})

        return lastSevenDays.map((date: string) => ({
            date,
            count: lookup[date]?.count || 0,
            totalAmount: lookup[date]?.totalAmount || 0
        }))
    };

    const sumCounts = (raw: any[], startOffset: number, endOffset: number) => {
        const start = toZonedTime(startOfDay(subDays(today, startOffset)), timeZone);
        const end = toZonedTime(startOfDay(subDays(today, endOffset)), timeZone);
        const startStr = format(start, "yyyy-MM-dd");
        const endStr = format(end, "yyyy-MM-dd");

        return raw.filter(r => r._id <= endStr && r._id >= startStr)
        .reduce((prev, current) => {
            prev.count += current.count
            prev.totalAmount += current.totalAmount
            return prev;
        }, { count: 0, totalAmount: 0 })
    }

    const thisWeekUsers = sumCounts(usersRaw, 6, 0);
    const lastWeekUsers = sumCounts(usersRaw, 13, 7);

    const thisWeekAgents = sumCounts(agentsRaw, 6, 0);
    const lastWeekAgents = sumCounts(agentsRaw, 13, 7);

    const thisWeekTransactions = sumCounts(transactionsRaw, 6, 0);
    const lastWeekTransactions = sumCounts(transactionsRaw, 13, 7);

    const calcGrowth = (thisVal: number, prevVal: number) => {
        if (prevVal === 0) {
            if (thisVal === 0) return "0%";
            return `+${thisVal}`
        };
        const growth = ((thisVal - prevVal) / prevVal) * 100;
        return `${growth >= 0 ? "+" : ""}${growth.toFixed(2)}%`;
    };

    return {
            usersPerDay: fillMissingDays(usersRaw),
            agentsPerDay: fillMissingDays(agentsRaw),
            transactionsPerDay: fillMissingDays(transactionsRaw),
            thisWeekCount: {
                users: thisWeekUsers,
                agents: thisWeekAgents,
                transactions: thisWeekTransactions
            },
            growth: {
                users: calcGrowth(thisWeekUsers.count, lastWeekUsers.count),
                agents: calcGrowth(thisWeekAgents.count, lastWeekAgents.count),
                transactions: calcGrowth(thisWeekTransactions.count, lastWeekTransactions.count),
                transactionAmount: calcGrowth(thisWeekTransactions.totalAmount, lastWeekTransactions.totalAmount),
                totalUsersAndAgents: calcGrowth(thisWeekUsers.count + thisWeekAgents.count, lastWeekUsers.count+lastWeekAgents.count)
            }
        }
}

export const statsService = {
    getStats
}