const { compare } = require("bcryptjs");
const knex = require("../database/knex/index.js")
const AppError = require("../utils/AppError.js")
const authConfig = require("../configs/auth.js")
const { sign } = require("jsonwebtoken")

class SessionsController {
  async create(request, response){
    const { email, password } = request.body;

    const user = await knex("users").where({email}).first();

    if(!user) {
      throw new AppError('eMail e/ou senha incorreta!', 401)
    }

    const matchedPassword = await compare(password, user.password)

    if(!matchedPassword) {
      throw new AppError('eMail e/ou senha incorreta!', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })



    return response.json({user, token})
  }
}

module.exports = SessionsController;