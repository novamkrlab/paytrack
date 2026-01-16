import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Chatbot router
  chat: router({
    sendMessage: publicProcedure
      .input(
        z.object({
          message: z.string(),
          context: z
            .object({
              monthlyIncome: z.number(),
              monthlyExpenses: z.number(),
              totalDebt: z.number(),
              currentSavings: z.number(),
              healthScore: z.number(),
            })
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { message, context } = input;

        // Sistem promptu oluştur
        let systemPrompt = `Sen bir finansal danışman asistandır. Kullanıcıya basit, anlaşılır ve Türkçe cevaplar ver.

Cevaplarında:
- Kısa ve öz ol (max 150 kelime)
- Örnekler ver
- Sayılarla açıkla
- Pozitif ve motive edici ol
- Emojiler kullanabilirsin`;

        if (context) {
          systemPrompt += `

Kullanıcının finansal durumu:
- Aylık gelir: ${context.monthlyIncome} TL
- Aylık harcama: ${context.monthlyExpenses} TL
- Toplam borç: ${context.totalDebt} TL
- Mevcut birikim: ${context.currentSavings} TL
- Finansal sağlık skoru: ${context.healthScore}/100`;
        }

        // LLM'den cevap al
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        });

        const reply = response.choices[0].message.content;

        return {
          reply,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
