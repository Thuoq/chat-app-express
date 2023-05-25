const admin = require('firebase-admin')

const serviceAccount = require('../../firebase-service-account.json')

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://project-eco-db.firebaseio.com',
})
module.exports = firebase
