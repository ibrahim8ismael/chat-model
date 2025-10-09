import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordMatch) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  pages: {
    signIn: '/signin', // Redirect to our new sign in page
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await dbConnect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await User.create({
              email: user.email,
              name: user.name,
              password: hashedPassword, // Or generate a random one
            });
          }
        } catch (err) {
          console.log(err);
          return false;
        }
      }
      return true;
    },
  }
});

export { handler as GET, handler as POST };
