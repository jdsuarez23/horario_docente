const bcrypt = require('bcryptjs');

// Contraseñas de prueba
const passwords = {
  'admin123': 'admin',
  'coord123': 'coordinador',
  'docente123': 'carlos.rodriguez'
};

async function generateHashes() {
  console.log('🔐 Generando hashes de bcrypt para contraseñas de prueba...\n');
  
  for (const [password, username] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`Usuario: ${username}`);
    console.log(`Contraseña: ${password}`);
    console.log(`Hash: ${hash}\n`);
  }
}

generateHashes().catch(console.error);
