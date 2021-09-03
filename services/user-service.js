const UserModel = require('../model/user-model.js')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service.js')
const tokenService = require('./token-service.js')
const UserDto = require('../dtos/user-dto.js')
const ApiError = require('../exceptions/api-erroe.js')
const userModel = require('../model/user-model.js')


class UserService {
   async registration(email, password) {
      const candidate = await UserModel.findOne({
         email
      })

      // Проверяем нет ли с таким емейлом пользователя в базе
      if (candidate) {
         throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} существует`)
      }
      // Хэштруем пароль и сохраняем кащ базу данных

      const hashedPasswor = await bcrypt.hash(password, 3)
      // Гененрируем рандомную строку для активации по почте
      const activationLink = uuid.v4() // brbterb.bertbb/brtbertb

      const user = await UserModel.create({
         email,
         password: hashedPasswor,
         activationLink,
      })
      // Отправляем ссылку 
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
      // Генерируем токины 
      const userDto = new UserDto(user)
      const token = tokenService.generateToken({
         ...userDto
      })

      await tokenService.saveToken(userDto.id, token.refreshToken)

      return {
         ...token,
         user: userDto
      }

   }

   async activate(link) {
      const user = await UserModel.findOne({
         link
      })

      if (!user) {
         throw ApiError.BadRequest('Wrong activation link')
      }
      user.isActivated = true
      await user.save();

   }



   async login(email, password) {
      const user = await userModel.findOne({
         email
      })

      if (!user) {
         throw ApiError.BadRequest('User with this email is undefined')
      }

      const isPassEquals = await bcrypt.compare(password, user.password)
      if (!isPassEquals) {
         throw ApiError.BadRequest('Password in incorect')
      }

      const userDto = new UserDto(user)
      const token = tokenService.generateToken({
         ...userDto
      })

      await tokenService.saveToken(userDto.id, token.refreshToken)

      return {
         ...token,
         user: userDto
      }


   }


   async logout(refreshToken) {
      const token = tokenService.deleteToken(refreshToken)
      return token;
   }


   async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.UnauthorizedError();
      }
      const userData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken);
      if (!userData || !tokenFromDb) {
         throw ApiError.UnauthorizedError();
      }
      const user = await UserModel.findById(userData.id);
      const userDto = new UserDto(user);
      const tokens = tokenService.generateToken({
         ...userDto
      });

      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      return {
         ...tokens,
         user: userDto
      }
   }

   async getAllUser() {
      const users = await UserModel.find()
      return users
   }


}


module.exports = new UserService()