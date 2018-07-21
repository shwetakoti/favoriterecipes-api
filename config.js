'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://skoti:Archie123@ds143461.mlab.com:43461/favoriterecipes';
//exports.PORT = process.env.PORT || 8080;
//exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_SECRET = 'favoriterecipes';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '365d';
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'
