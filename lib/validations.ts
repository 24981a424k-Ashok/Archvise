import * as z from 'zod'

export const auditUploadSchema = z.object({
  projectName: z.string()
    .min(1, { message: "Project name is required" })
    .max(100, { message: "Project name cannot exceed 100 characters" }),
  fileType: z.enum(['Backend', 'Frontend', 'Mixed'], {
    message: "Please select a valid focus"
  }),
  displayMode: z.enum(['founder', 'engineer'])
})

export const githubAuditSchema = z.object({
  projectName: z.string()
    .min(1, { message: "Project name is required" })
    .max(100, { message: "Project name cannot exceed 100 characters" }),
  repo: z.string().min(1, { message: "GitHub repository selection is required" }),
  branch: z.string().min(1, { message: "Repository branch selection is required" }),
  fileType: z.enum(['Backend', 'Frontend', 'Mixed']),
  displayMode: z.enum(['founder', 'engineer'])
})

export const systemDesignSchema = z.object({
  ideaPrompt: z.string()
    .min(20, { message: "Concept description must be at least 20 characters" })
    .max(2000, { message: "Concept description cannot exceed 2000 characters" }),
  displayMode: z.enum(['founder', 'engineer'])
})
