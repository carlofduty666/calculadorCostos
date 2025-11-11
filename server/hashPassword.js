import bcrypt from 'bcryptjs';

// Script para generar hash de contraseña
// Uso: npm run hash-password

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    process.exit(1);
  }
  console.log('\n✅ Contraseña hasheada:');
  console.log(hash);
  console.log('\nUsa este hash en la tabla admin de la base de datos');
  process.exit(0);
});