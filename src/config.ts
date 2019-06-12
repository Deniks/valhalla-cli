require('dotenv').config();

export const uri = `mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.APP_NAME}`;
