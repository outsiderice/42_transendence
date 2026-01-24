const TTL = 45_000 // 45 segundos
const presence = new Map<string, NodeJS.Timeout>()

export function heartbeat(userId: string) {
  const prev = presence.get(userId)
  if (prev) clearTimeout(prev)

  const timeout = setTimeout(() => {
    presence.delete(userId)
  }, TTL)

  presence.set(userId, timeout)
}

export function isOnline(userId: string): boolean {
  return presence.has(userId)
}

export function getStatuses(userIds: string[]) {
  return userIds.map(id => ({
    userId: id,
    status: presence.has(id) ? 'online' : 'offline'
  }))
}

// Presencia global (solo IDs online)
export function getOnlineUserIds(): string[] {
  return Array.from(presence.keys())
}
