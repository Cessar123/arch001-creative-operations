import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";
import {
  addChatMessage,
  createProject,
  getMessagesByProject,
  getProjectById,
  getProjectsByUser,
  updateProject,
} from "./db";
import { runCreativeArchitecture } from "./creativeEngine";

const projectIdInput = z.object({ projectId: z.number().int().positive() });

function ensureProject<T>(project: T | undefined): T {
  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود أو لا تملك صلاحية الوصول إليه." });
  }
  return project;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  projects: router({
    list: protectedProcedure.query(({ ctx }) => getProjectsByUser(ctx.user.id)),
    get: protectedProcedure.input(projectIdInput).query(async ({ ctx, input }) => {
      const project = ensureProject(await getProjectById(input.projectId, ctx.user.id));
      const messages = await getMessagesByProject(input.projectId, ctx.user.id);
      return { project, messages };
    }),
    create: protectedProcedure
      .input(z.object({ title: z.string().trim().min(1).max(255), premise: z.string().trim().min(10).max(10000) }))
      .mutation(async ({ ctx, input }) => {
        const projectId = await createProject({
          userId: ctx.user.id,
          title: input.title,
          premise: input.premise,
          currentStage: 1,
        });
        await addChatMessage({
          projectId,
          userId: ctx.user.id,
          role: "user",
          content: input.premise,
          stage: 1,
        });
        return { projectId };
      }),
  }),
  chat: router({
    history: protectedProcedure.input(projectIdInput).query(({ ctx, input }) => getMessagesByProject(input.projectId, ctx.user.id)),
    send: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), content: z.string().trim().min(2).max(12000) }))
      .mutation(async ({ ctx, input }) => {
        const project = ensureProject(await getProjectById(input.projectId, ctx.user.id));
        const previousMessages = await getMessagesByProject(input.projectId, ctx.user.id);
        await addChatMessage({
          projectId: project.id,
          userId: ctx.user.id,
          role: "user",
          content: input.content,
          stage: project.currentStage,
        });

        const previousContext = [
          `Project premise: ${project.premise}`,
          ...previousMessages.slice(-8).map(message => `${message.role}: ${message.content}`),
        ];
        const output = await runCreativeArchitecture(input.content, previousContext, project.currentStage);
        const nextStage = Math.min(4, project.currentStage + 1);
        await updateProject(project.id, ctx.user.id, {
          currentStage: nextStage,
          charactersData: JSON.stringify(output.stages.characters),
          vehiclesData: JSON.stringify(output.stages.vehicles),
          locationsData: JSON.stringify(output.stages.locations),
          scriptData: JSON.stringify(output.stages.episode),
          promoData: JSON.stringify(output.promo),
        });
        await addChatMessage({
          projectId: project.id,
          userId: ctx.user.id,
          role: "assistant",
          content: JSON.stringify(output),
          stage: nextStage,
        });
        return { ...output, currentStage: nextStage, completedStage: project.currentStage };
      }),
  }),
  assets: router({
    generateImage: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), kind: z.enum(["characters", "locations"]), prompt: z.string().trim().min(10).max(10000) }))
      .mutation(async ({ ctx, input }) => {
        const project = ensureProject(await getProjectById(input.projectId, ctx.user.id));
        const result = await generateImage({ prompt: input.prompt, quality: "high" });
        await updateProject(project.id, ctx.user.id, input.kind === "characters" ? { charactersImageUrl: result.url } : { locationsImageUrl: result.url });
        return { url: result.url, kind: input.kind };
      }),
  }),
});

export type AppRouter = typeof appRouter;
