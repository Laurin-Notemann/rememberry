import { router, publicProcedure } from "../trpc";
import * as stackModels from '../stacks/stackModels'
import z from 'zod'

const stackInput = z.object({
    user_id: z.string(),
    stack_name: z.string(),
    topic: z.string()
})

const searchByTopicInput = z.object({
    user_id: z.string(),
    topic: z.string()
})

const userIdInput = z.object({userId:z.string()})

export const stackRouter = router({

    getUsersStacksFilteredByTopic: publicProcedure.input(searchByTopicInput).query(async(opts)=>{
        const res = await stackModels.getUsersStacksFilteredByTopic(opts.input.user_id, opts.input.topic, opts.ctx.db)
        return res
    }),

    getUsersStacksFilteredByLearnableCards: publicProcedure.input(userIdInput).query(async(opts) => {
        const res = await stackModels.getUsersStacksOrderedByLearnableCards(opts.input.userId, opts.ctx.db)
        return res
    }),

    createStack: publicProcedure.input(stackInput).query(async(opts) => {
        const res = await stackModels.createStack(opts.input, opts.input.topic, opts.ctx.db)
        return res
    })

})