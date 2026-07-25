import { CosmosClient, type ItemDefinition } from '@azure/cosmos'

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT!,
  key: process.env.COSMOS_KEY!,
})

const db = client.database(process.env.COSMOS_DATABASE ?? 'velli')

export const containers = {
  users: () => db.container('velli_users'),
  pages: () => db.container('velli_pages'),
  subscribers: () => db.container('velli_subscribers'),
  messages: () => db.container('velli_messages'),
  emailLog: () => db.container('velli_emailLog'),
  feedback: () => db.container('velli_feedback'),
} as const

type ContainerName = keyof typeof containers

type QueryParamValue = string | number | boolean | null

// Point read (requires partition key = id for most containers)
export async function getById<T extends ItemDefinition>(
  c: ContainerName,
  id: string,
  partitionKey?: string
): Promise<T | null> {
  try {
    const { resource } = await containers[c]()
      .item(id, partitionKey ?? id)
      .read<T>()
    return resource ?? null
  } catch {
    return null
  }
}

// SQL query
export async function query<T>(
  c: ContainerName,
  sql: string,
  params: Record<string, QueryParamValue> = {}
): Promise<T[]> {
  const { resources } = await containers[c]()
    .items.query<T>({
      query: sql,
      parameters: Object.entries(params).map(([name, value]) => ({ name: `@${name}`, value })),
    })
    .fetchAll()
  return resources
}

// Upsert
export async function upsert<T extends ItemDefinition>(c: ContainerName, item: T): Promise<T> {
  const { resource } = await containers[c]().items.upsert<T>(item)
  return resource! as T
}

// Delete
export async function deleteItem(c: ContainerName, id: string, partitionKey?: string) {
  await containers[c]()
    .item(id, partitionKey ?? id)
    .delete()
}

// Bootstraps the database + containers if they don't exist yet.
// Safe to call repeatedly (idempotent) — intended for local/dev setup.
export async function ensureDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: process.env.COSMOS_DATABASE ?? 'velli',
  })
  await database.containers.createIfNotExists({ id: 'velli_users', partitionKey: '/id' })
  await database.containers.createIfNotExists({ id: 'velli_pages', partitionKey: '/id' })
  await database.containers.createIfNotExists({ id: 'velli_subscribers', partitionKey: '/pageId' })
  await database.containers.createIfNotExists({ id: 'velli_messages', partitionKey: '/pageId' })
  await database.containers.createIfNotExists({ id: 'velli_emailLog', partitionKey: '/pageId' })
  await database.containers.createIfNotExists({ id: 'velli_feedback', partitionKey: '/id' })
}
