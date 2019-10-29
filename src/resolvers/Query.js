import getUserId from '../utils/getUserId'

const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    opArgs.where = {
      AND: [{
        rule: 'user'
      }]
    }

    if (args.query) {
      opArgs.where.OR = [{
        name_contains: args.query
      }]
    }

    return prisma.query.users(opArgs, info)
  },
  credits(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
    }

    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }]
      }
    }

    return prisma.query.credits(opArgs, info)
  },
  userCredits(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy,
      where: {
        by: {
          id: userId
        }
      }
    }

    if (args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }]
      }
    }

    return prisma.query.credits(opArgs, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    })
  },
  async credit(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const credits = await prisma.query.credits({
      where: {
        id: args.id
      }
    }, info)

    if (credits.length === 0) {
      throw new Error('Credit not found')
    }

    return credits[0]
  }
}

export { Query as default }