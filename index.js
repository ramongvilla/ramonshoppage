const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Inicializa Firebase Admin SDK
const privateKey = process.env.FIREBASE_PRIVATE_KEY;
console.log(process.env);

if (!privateKey) {
  console.error("FIREBASE_PRIVATE_KEY no está definido");
  process.exit(1); // Detiene la app si falta la variable
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: privateKey.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});


// Access Cloud Firestore
const db = admin.firestore();

// Middleware para habilitar CORS (para permitir solicitudes desde tu frontend)
app.use(cors());
app.use(express.json()); // Necesario para analizar el cuerpo de las solicitudes POST con formato JSON

// Endpoint para obtener las invitaciones
app.get('/carts', async (req, res) => {
  try {
    const invitacionesCollection = db.collection('carts');
    const snapshot = await invitacionesCollection.get();

    if (snapshot.empty) {
      res.status(404).send('No se encontraron invitaciones.');
      return;
    }

    const invitaciones = [];
    snapshot.forEach(doc => {
      invitaciones.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(invitaciones);

  } catch (error) {
    console.error('Error al obtener las invitaciones:', error);
    res.status(500).send('Error al obtener las invitaciones.');
  }
});
// Endpoint para obtener las invitaciones
app.get('/products', async (req, res) => {
  try {
    const invitacionesCollection = db.collection('products');
    const snapshot = await invitacionesCollection.get();

    if (snapshot.empty) {
      res.status(404).send('No se encontraron invitaciones.');
      return;
    }

    const invitaciones = [];
    snapshot.forEach(doc => {
      invitaciones.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(invitaciones);

  } catch (error) {
    console.error('Error al obtener las invitaciones:', error);
    res.status(500).send('Error al obtener las invitaciones.');
  }
});

// Endpoint para agregar una nueva invitación
app.post('/addCarts', async (req, res) => {
  try {
    const nuevaInvitacion = req.body; // Los datos de la nueva invitación vendrán en el cuerpo de la petición
    const invitacionesCollection = db.collection('carts');

    // Agregamos el nuevo documento a la colección
    const nuevaInvitacionRef = await invitacionesCollection.add(nuevaInvitacion);

    // Respondemos con el ID del nuevo documento y los datos
    res.status(201).json({
      id: nuevaInvitacionRef.id, // El ID del documento generado por Firestore
      ...nuevaInvitacion
    });

  } catch (error) {
    console.error('Error al agregar la invitación:', error);
    res.status(500).send('Error al agregar la invitación.');
  }
});
app.post('/addProducts', async (req, res) => {
  try {
    const nuevaInvitacion = req.body; // Los datos de la nueva invitación vendrán en el cuerpo de la petición
    const invitacionesCollection = db.collection('products');

    // Agregamos el nuevo documento a la colección
    const nuevaInvitacionRef = await invitacionesCollection.add(nuevaInvitacion);

    // Respondemos con el ID del nuevo documento y los datos
    res.status(201).json({
      id: nuevaInvitacionRef.id, // El ID del documento generado por Firestore
      ...nuevaInvitacion
    });

  } catch (error) {
    console.error('Error al agregar la invitación:', error);
    res.status(500).send('Error al agregar la invitación.');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
