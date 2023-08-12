require("dotenv/config")

const { env } = process;

const config = {
    port: env.PORT,
    jwtSecretKey: env.JWT_SECRETKEY
}

module.exports = config;