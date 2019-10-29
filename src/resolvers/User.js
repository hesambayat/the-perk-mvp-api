import getUserId from '../utils/getUserId'

const User = {
  credits: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.credits({
        where: {
          creditTo: {
            id: parent.id
          }
        }
      }, info)
    }
  },
  balance: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, ctx, info) {
      try {
        return parent.credits.reduce((acc, curr) => {
          return acc + curr.amount
        }, 0)
      } catch (_) {
        return 0.00
      }
    }
  },
  lastTransaction: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, ctx, info) {
      try {
        return parent.credits[parent.credits.length - 1]
      } catch (_) {
        return 0.00
      }
    }
  }
}

export { User as default }