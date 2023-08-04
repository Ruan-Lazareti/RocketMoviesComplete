const {hash, compare} = require("bcryptjs")
const AppError = require("../utils/AppError.js")
const sqliteConnection = require("../database/sqlite/index.js")

class UserController {
 async create(request, response) {
  const {name, email, password} = request.body
  const database = await sqliteConnection()
  const checkIfExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
  const hashedPassword = await hash(password, 8)

  if(checkIfExists) {
    throw new AppError("Email já está em uso!")
  }

  if(!name) {
    throw new AppError("Nome é obrigatório!")
  }

  await database.run ("INSERT INTO users (name, email, password) VALUES(?, ?, ?)",
  [name, email, hashedPassword])

  response.status(201).json({name, email, hashedPassword})
 }

 async update(request, response) {
  const {name, email, password, old_password} = request.body
  const user_id = request.user.id
  const database = await sqliteConnection()
  const user = await database.get('SELECT * FROM users WHERE id = (?)', user_id)
  const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

  if(!user) {
    throw new AppError('Usuário não encontrado!')
  }

  if(userWithUpdatedEmail && userWithUpdatedEmail.id != user_id) {
    throw new AppError('Este e-mail já está em uso.')
  }

  if(!old_password) {
    throw new AppError('A senha antiga deve ser preenchida.')
  }

  if(password && old_password) {
    const checkOldPassword = await compare(old_password, user.password)

    if(!checkOldPassword) {
      throw new AppError('A senha antiga informada está incorreta.')
    }

    user.password = await hash(password, 8)
  }

  user.name = name ?? user.name
  user.email = email ?? user.email
  
  await database.run(`
  UPDATE users
     SET name = (?),
         email = (?),
         password = (?),
         updated_at = DATETIME('now')
   WHERE id = (?)`,
   [user.name, user.email, user.password, user_id])

  return response.status(201).json()
 }
}

module.exports = UserController