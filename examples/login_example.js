/**
 * Login Component Usage Example
 */

import { LoginComponent } from '../src/LoginComponent.js';

async function main() {
  const loginComponent = new LoginComponent();

  console.log('=== Login Component Example ===\n');

  // Example 1: Valid credentials
  console.log('Ejemplo 1: Credenciales válidas');
  const result1 = await loginComponent.login('usuario@ejemplo.com', 'Password123');
  console.log(result1);
  console.log('');

  // Example 2: Invalid email format
  console.log('Ejemplo 2: Formato de correo inválido');
  const result2 = await loginComponent.login('correo-invalido', 'Password123');
  console.log(result2);
  console.log('');

  // Example 3: Weak password
  console.log('Ejemplo 3: Contraseña débil');
  const result3 = await loginComponent.login('usuario@ejemplo.com', '12345');
  console.log(result3);
  console.log('');

  // Example 4: Empty fields
  console.log('Ejemplo 4: Campos vacíos');
  const result4 = await loginComponent.login('', '');
  console.log(result4);
  console.log('');

  // Example 5: Password without uppercase
  console.log('Ejemplo 5: Contraseña sin mayúsculas');
  const result5 = await loginComponent.login('usuario@ejemplo.com', 'password123');
  console.log(result5);
  console.log('');

  // Example 6: Individual validation
  console.log('Ejemplo 6: Validación individual de correo');
  const emailValidation = loginComponent.validateEmail('test@test.com');
  console.log(emailValidation);
  console.log('');

  console.log('Ejemplo 7: Validación individual de contraseña');
  const passwordValidation = loginComponent.validatePassword('MySecurePass123');
  console.log(passwordValidation);
}

main().catch(console.error);
