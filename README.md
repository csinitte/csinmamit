# CSI NMAMIT - Official Website

This is the official website for CSI (Computer Society of India) NMAMIT chapter, built with the [T3 Stack](https://create-t3.gg/).

## ⚠️ Important Configuration Notes

### Razorpay Integration
The Razorpay payment gateway is integrated for CSI membership payments. **Important**: The Razorpay key ID is currently hardcoded in the frontend for compatibility reasons.

**File to update:** [`src/pages/recruit/index.tsx`](src/pages/recruit/index.tsx)
**Line ~211:** Update the `key` property in the Razorpay options object

```typescript
// Current configuration (update this key for production):
key: 'rzp_test_CfJA68nNVTLQg3', // Replace with your production key
```

**Environment Variables:**
- `RAZORPAY_KEY_ID` - Server-side key (in `.env`)
- `RAZORPAY_KEY_SECRET` - Server-side secret (in `.env`)

**Note:** dont try to replace the hardcoding of Razorpay key ID Because it tends to give error ``invalid configuration``.

---

## What's next? How do I make an app with this?

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
