import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import axios from "axios"
import "dotenv/config"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Send user data to your backend using axios
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauthLogin`,
          {
            email: user.email,
            username: user.name || user.email?.split('@')[0],
            provider: account?.provider
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
        console.log("backend response: ",response.status, response.data)

        if (response.status !== 200) {
          console.error('Backend OAuth login failed:', response.data)
          return false
        }

        const data = response.data
        
        // Store tokens in user object
        user.accessToken = data.accessToken
        user.refreshToken = data.refreshToken
        user.userId = data.user._id

        console.log('OAuth login successful:', user.email)
        return true
      } catch (error) {
        console.error('OAuth sign-in error:', error)
        return false
      }
    },
    
    async jwt({ token, user }) {
      // Persist tokens to JWT token
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.userId
      }
      return token
    },
    
    async session({ session, token }) {
      // Add tokens to session for client-side access
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.userId = token.userId as string
      return session
    }
  },
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }