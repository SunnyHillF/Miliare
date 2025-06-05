// Use dynamic import to minimize bundle size per AGENTS.md
import type { fetchAuthSession as fetchAuthSessionType } from 'aws-amplify/auth'

export interface GraphQLRequest<TVariables = Record<string, any>> {
  query: string
  variables?: TVariables
}

export async function graphqlRequest<TData, TVariables = Record<string, any>>(
  request: GraphQLRequest<TVariables>
): Promise<TData> {
  const { fetchAuthSession } = await import('aws-amplify/auth')
  const { tokens } = await (fetchAuthSession as typeof fetchAuthSessionType)()
  const token = tokens?.accessToken?.toString()

  const endpoint = process.env.GRAPHQL_ENDPOINT as string | undefined
  if (!endpoint) {
    throw new Error('GRAPHQL_ENDPOINT is not set')
  }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed with ${res.status}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'Unknown GraphQL error')
  }

  return json.data as TData
}
