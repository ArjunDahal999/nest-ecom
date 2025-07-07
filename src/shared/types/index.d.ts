import { z } from 'zod';

const envVariable = z.object({
  DATABASE_URL: z.string(),
  JWT_ACCESS_TOKEN_EXP: z.coerce.number(),
  JWT_REFRESH_TOKEN_EXP: z.coerce.number(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.coerce.number(),
  MAIL_SECURE: z.coerce.boolean(),
  MAIL_USER: z.string(),
  MAIL_PASSWORD: z.string(),
});

envVariable.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends z.infer<typeof envVariable> {}
  }
}
