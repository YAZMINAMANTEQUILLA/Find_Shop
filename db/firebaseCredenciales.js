var admin = require("firebase-admin");
require('dotenv').config();

const serviceAccount = require('/etc/secrets/firebase-key.json'); // ✅


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
module.exports = { admin, db };