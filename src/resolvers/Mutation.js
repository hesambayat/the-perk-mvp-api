import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    })

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async login(parent, args, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    })

    if (!user) {
      throw new Error('Email or password is wrong')
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password)

    if (!isMatch) {
      throw new Error('Email or password is wrong')
    }

    return {
      user,
      token: generateToken(user.id)
    }
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.deleteUser({
      where: {
        id: userId
      }
    }, info)
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if (typeof args.data.password === 'string') {
      args.data.password = await hashPassword(args.data.password)
    }

    return prisma.mutation.updateUser({
      where: {
        id: userId
      },
      data: args.data
    }, info)
  },
  createCredit(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.mutation.createCredit({
      data: {
        title: args.data.title,
        amount: args.data.amount,
        creditTo: {
          connect: {
            id: args.data.creditTo
          }
        },
        creditBy: {
          connect: {
            id: userId
          }
        }
      }
    }, info)
  },
  async deleteCredit(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const creditExists = await prisma.exists.Credit({
      id: args.id,
      by: {
        id: userId
      }
    })

    if (!creditExists) {
      throw new Error('Unable to delete credit')
    }

    return prisma.mutation.deleteCredit({
      where: {
        id: args.id
      }
    }, info)
  },
  async updateCredit(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const creditExists = await prisma.exists.Credit({
      id: args.id,
      by: {
        id: userId
      }
    })

    if (!creditExists) {
      throw new Error('Unable to update credit')
    }

    return prisma.mutation.updateCredit({
      where: {
        id: args.id
      },
      data: args.data
    }, info)
  }
}

export { Mutation as default }