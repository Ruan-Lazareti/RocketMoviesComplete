const knex = require("../database/knex/index.js")
const AppError = require("../utils/AppError.js")
const DiskStorage = require("../providers/DiskStorage.js")


class UserAvatarController {
  async update(req, res) {
    const user_id = req.user.id
    const avatarFilename = req.file.filename
    const user = await knex("users").where({id: user_id}).first()

    const diskStorage = new DiskStorage()

    if(!user) {
      throw new AppError('Usuário não encontrado!')
    }

    if(user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFilename)
    user.avatar = filename

    await knex('users').update(user).where({id: user_id})

    res.json(user)
  }
}

module.exports = UserAvatarController