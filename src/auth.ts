import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { randomUUID } from 'crypto'
import { query, upsert } from '@/lib/cosmos'
import type { User as VelliUser } from '@/types'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: { signIn: '/login' },
  callbacks: {
    // Runs on every request; `user`/`account` are only populated right after sign-in.
    // That's where we upsert the Cosmos `users` doc and pin its uuid onto the token,
    // so session.user.id is always the Cosmos id — every page.ownerId check depends on this.
    async jwt({ token, user, account }) {
      if (account && user?.email) {
        const email = user.email
        const existing = await query<VelliUser>('users', 'SELECT * FROM c WHERE c.email = @email', { email })
        const now = new Date().toISOString()

        if (existing[0]) {
          await upsert<VelliUser>('users', {
            ...existing[0],
            name: user.name ?? existing[0].name,
            image: user.image ?? existing[0].image,
            lastLoginAt: now,
          })
          token.id = existing[0].id
        } else {
          const id = randomUUID()
          await upsert<VelliUser>('users', {
            id,
            email,
            name: user.name ?? '',
            image: user.image ?? null,
            createdAt: now,
            lastLoginAt: now,
          })
          token.id = id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id
      return session
    },
  },
})
