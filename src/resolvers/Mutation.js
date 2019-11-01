import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const password = await hashPassword(args.data.password)

    if (!args.data.name.trim()) {
      throw new Error('Name is required')
    }

    const email = String(args.data.email).trim().toLowerCase()
    if (!email) {
      throw new Error('Email is required')
    }

    const reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (!reg.test(email)) {
      throw new Error('Enter a valid email')
    }

    if (!args.data.department.connect.id) {
      throw new Error('Department is required')
    }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        email,
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

    const amount = Number(args.data.amount)
    if (!amount || isNaN(amount)) {
      throw new Error('Amount is required')
    }

    const title = String(args.data.title).trim()
    if (!title) {
      throw new Error('Title is required')
    }

    if (!args.data.creditTo.connect.id) {
      throw new Error('Employee is required')
    }

    return prisma.mutation.createCredit({
      data: {
        ...args.data,
        amount,
        title,
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