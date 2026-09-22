import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch';
import type { ContractRouterClient } from '@orpc/contract';
import { usersContract } from '@my-app/shared';

const link = new RPCLink({
  url: `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/rpc`,
});

export const api: ContractRouterClient<typeof usersContract> = createORPCClient(link);