const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const config = require('../config.json')
const adapter = new FileSync(path.resolve(__dirname, config.db))
const db = low(adapter)

module.exports = db;