import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import "dotenv/config"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password
            },
            {
              headers: { 'Content-Type': 'application/json' }
            }
          )

          if (response.status !== 200) {
            return null
          }

          const data = response.data
          
          return {
            id: data.user._id,
            email: data.user.email,
            name: data.user.username,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            userId: data.user._id
          }
        } catch (error) {
          console.error('Credential login error:', error)
          return null
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/oauthLogin`,
            {
              email: user.email,
              username: user.name || user.email?.split('@')[0],
              provider: account?.provider
            },
            {
              headers: { 'Content-Type': 'application/json' }
            }
          )

          if (response.status !== 200) {
            return false
          }

          const data = response.data
          
          user.accessToken = data.accessToken
          user.refreshToken = data.refreshToken
          user.userId = data.user._id

          return true
        } catch (error) {
          console.error('OAuth sign-in error:', error)
          return false
        }
      }
      
      return true
    },
    
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.userId = user.userId
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000 // 15 minutes from now
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to refresh it
      console.log('Access token expired, refreshing...')
      return refreshAccessToken(token)
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.userId = token.userId as string
      session.error = token.error as string | undefined
      return session
    }
  },
  
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

// Function to refresh access token
async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken: token.refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    )

    const refreshedTokens = response.data

    if (response.status !== 200) {
      throw refreshedTokens
    }

    console.log('Token refreshed successfully via NextAuth')

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token if new one not provided
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }