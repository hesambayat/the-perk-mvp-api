const Subscription = {
  credit: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.subscription.comment(null, info)
    }
  }
}

export { Subscription as default }