const Subscription = {
  user: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.user(null, info)
    }
  },
  credit: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.credit(null, info)
    }
  }
}

export { Subscription as default }