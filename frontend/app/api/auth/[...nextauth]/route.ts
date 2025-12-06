import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Redirect to chat after sign in
            if (url.startsWith(baseUrl)) return url;
            return baseUrl + '/chat';
        },
        async session({ session, token: _token }) {
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
