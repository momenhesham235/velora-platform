/**
 * Normalize MongoDB JSON documents to client wire shapes (id + ISO date strings).
 */

type WithMongoId = {
  _id?: unknown;
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

function toIso(value: string | Date | undefined): string {
  if (value == null) return new Date(0).toISOString();
  return typeof value === 'string' ? value : value.toISOString();
}

export function normalizeEntity<T extends WithMongoId>(
  raw: T
): Omit<T, '_id'> & { id: string; createdAt: string; updatedAt: string } {
  const { _id, ...rest } = raw;
  const id = raw.id ?? String(_id);
  return {
    ...rest,
    id,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt),
  } as Omit<T, '_id'> & { id: string; createdAt: string; updatedAt: string };
}

export function normalizeEntities<T extends WithMongoId>(
  items: T[]
): Array<Omit<T, '_id'> & { id: string; createdAt: string; updatedAt: string }> {
  return items.map((item) => normalizeEntity(item));
}
