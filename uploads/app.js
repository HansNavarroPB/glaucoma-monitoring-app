const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para procesar datos en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en timestamp
  }
});
const upload = multer({ storage: storage });

// Leer datos de usuarios desde archivo JSON
let usersData = require('./data.json');

// Ruta para login de usuarios
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const patient = usersData.patients.find(user => user.username === username && user.password === password);
  const specialist = usersData.specialists.find(user => user.username === username && user.password === password);
  
  if (patient) {
    res.json({ role: 'patient', data: patient });
  } else if (specialist) {
    res.json({ role: 'specialist', data: specialist });
  } else {
    res.status(401).json({ message: 'Usuario o contraseña inválidos.' });
  }
});

// Ruta para registro de pacientes
app.post('/register', (req, res) => {
  const { name, age, gender, location, username, password } = req.body;
  
  const newPatient = {
    name,
    age,
    gender,
    location,
    username,
    password,
    images: []
  };

  usersData.patients.push(newPatient);
  
  fs.writeFileSync('./data.json', JSON.stringify(usersData, null, 2));
  res.json({ message: 'Registro exitoso' });
});

// Ruta para subir imágenes
app.post('/upload', upload.single('image'), (req, res) => {
  const { username, description } = req.body;
  const imagePath = req.file.path;
  
  const patient = usersData.patients.find(user => user.username === username);
  
  if (patient) {
    patient.images.push({ image: imagePath, description });
    fs.writeFileSync('./data.json', JSON.stringify(usersData, null, 2));
    res.json({ message: 'Imagen subida exitosamente' });
  } else {
    res.status(404).json({ message: 'Paciente no encontrado' });
  }
});

// Ruta para especialistas que revisan datos del paciente
app.post('/review', (req, res) => {
  const { patientUsername } = req.body;
  
  const patient = usersData.patients.find(user => user.username === patientUsername);
  
  if (patient) {
    res.json({ patient });
  } else {
    res.status(404).json({ message: 'Paciente no encontrado' });
  }
});

// Ruta para que los especialistas suban diagnóstico
app.post('/submit-diagnosis', (req, res) => {
  const { patientUsername, diagnosis } = req.body;
  
  const patient = usersData.patients.find(user => user.username === patientUsername);
  
  if (patient) {
    patient.diagnosis = diagnosis;
    fs.writeFileSync('./data.json', JSON.stringify(usersData, null, 2));
    res.json({ message: 'Diagnóstico guardado' });
  } else {
    res.status(404).json({ message: 'Paciente no encontrado' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});