const fs = require('fs');

// Leer datos desde un archivo JSON
let usersData = require('./data.json');

// Registro de Paciente
function registerPatient(data) {
  usersData.patients.push(data);
  fs.writeFileSync('./data.json', JSON.stringify(usersData, null, 2));
}

// Verificación de inicio de sesión
function login(username, password) {
  const patient = usersData.patients.find(user => user.username === username && user.password === password);
  const specialist = usersData.specialists.find(user => user.username === username && user.password === password);
  if (patient) {
    return { role: 'patient', data: patient };
  } else if (specialist) {
    return { role: 'specialist', data: specialist };
  } else {
    return null;
  }
}

// Funciones para subida de imagen, verificación de pacientes, etc. según el flujo que mencionaste.
