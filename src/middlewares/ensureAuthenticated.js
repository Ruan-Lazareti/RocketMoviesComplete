const authConfig = require("../configs/auth.js")
const { verify } = require("jsonwebtoken")
const AppError = require("../utils/AppError.js")

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization; //Estamos o "Authorization" dentro do header do nosso request, aqui trás todo nosso token
  //O resultado dessa const é bare xxxxxxxxxxx

  if(!authHeader) {
    throw new AppError("JWT Token não informado", 401); //Aqui é pra quando o Token estiver vazio emitir esse erro.
  }

  const [, token] = authHeader.split(" "); //Como o resultado da nossa const vem o bare e depois a informação que precisamos, utilizamos o split para quebrar sempre que tem espaço.
  //Neste caso, o split separou em 2 partes o nosso authHeader, por isso que colocamos dentro de um array.
  //Como o bare não nos interessa, apenas colocamos uma vírgula para informar que não precisamos do primeiro dado retornado do split.
  //Depois, colocamos como token, pois, toda a informação que existe depois do espaço por conta do split vai ser enviado para essa váriavel que criamos chamada de token.

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret); //Aqui estamos utilizando o verify que veio do nosso jsonwebtoken.
    //Esse verify precisa de 2 argumentos, o primeiro é o token em si, o segundo, é a configuração que foi utilizada para criar o secret do token.
    //O resultado desse verify vem como "sub", então, já renomeamos o sub para user_id na nossa const.
    //Ou seja, nossa const user_id vai retornar o id que existe dentro do token.

    request.user = {
      id: Number(user_id) //Aqui, estamos passando que dentro do nosso request.user o id vai ser o user_id que veio da const anterior.
    }

    return next() //Esse next de um middleware serve para que se tudo deu certo ele execute o next, que no caso seria a próxima função.
  } catch {
    throw new AppError("JWT Token inválido", 401) // Aqui no catch estamos lançando um novo erro para quando o nosso id estiver incorreto.
  }
}

module.exports = ensureAuthenticated