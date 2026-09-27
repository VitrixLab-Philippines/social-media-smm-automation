// Stub Prisma client for v3.0 PostgreSQL + Neon migration
// This provides the API surface needed by CRM API routes

export const prisma = {
  client: {
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
  },

  brandProfile: {
    findFirst: async function (): Promise<{ id: string; name: string } | null> {
      return null;
    },
    upsert: async function (): Promise<void> {
      return;
    },
    update: async function (): Promise<void> {
      return;
    },
    create: async function (): Promise<void> {
      return;
    },
  },

  contentDraft: {
    findMany: async function (): Promise<Array<{ id: string; topic: string; status: string }>> {
      return [];
    },
    findUnique: async function (): Promise<{ id: string; topic: string; status: string } | null> {
      return null;
    },
    create: async function (): Promise<{ id: string; topic: string; status: string }> {
      return { id: "new", topic: "", status: "draft" };
    },
    update: async function (): Promise<void> {
      return;
    },
    delete: async function (): Promise<void> {
      return;
    },
  },

  publishJob: {
    create: async function (): Promise<{ id: string; draftId: string; platform: string; status: string }> {
      return { id: "new", draftId: "", platform: "", status: "PENDING" };
    },
    update: async function (): Promise<void> {
      return;
    },
  },
};