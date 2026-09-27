// Stub Prisma Client - used when full Prisma codegen is not available.
// This provides the minimal API surface needed by the CRM API routes.

export const ClientStatus = "PROSPECT" | "ACTIVE" | "PAUSED" | "CHURNED";

export const client = {
  findMany: async function (model: string, where?: object, orderBy?: object): Promise<Array<object>> {
    return [];
  },

  findUnique: async function (model: string, where: { id: string }): Promise<object | null> {
    return null;
  },

  create: async function (model: string, data: object): Promise<object> {
    return {};
  },

  update: async function (model: string, where: { id: string }, data: object): Promise<object> {
    return {};
  },

  delete: async function (model: string, where: { id: string }): Promise<object> {
    return {};
  },

  count: async function (model: string, where?: object): Promise<{ _sum: { revenue?: number; postCount?: number } }> {
    return { _sum: {} };
  },

  aggregate: async function (model: string, where?: object): Promise<{ _sum: { revenue?: number; postCount?: number } }> {
    return { _sum: {} };
  },
};