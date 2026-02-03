/**
 * LoginComponent - Component for user authentication with email and password validation
 */

export class LoginComponent {
  constructor() {
    this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.minPasswordLength = 8;
  }

  /**
   * Validates email format
   * @param {string} email - Email to validate
   * @returns {object} Validation result with isValid and error message
   */
  validateEmail(email) {
    if (!email || email.trim() === '') {
      return {
        isValid: false,
        error: 'El correo electrónico es requerido'
      };
    }

    if (!this.emailRegex.test(email)) {
      return {
        isValid: false,
        error: 'El formato del correo electrónico no es válido'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Validates password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result with isValid and error message
   */
  validatePassword(password) {
    if (!password || password.trim() === '') {
      return {
        isValid: false,
        error: 'La contraseña es requerida'
      };
    }

    if (password.length < this.minPasswordLength) {
      return {
        isValid: false,
        error: `La contraseña debe tener al menos ${this.minPasswordLength} caracteres`
      };
    }

    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos una letra mayúscula'
      };
    }

    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos una letra minúscula'
      };
    }

    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        error: 'La contraseña debe contener al menos un número'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Validates login credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {object} Validation result
   */
  validate(email, password) {
    const emailValidation = this.validateEmail(email);
    const passwordValidation = this.validatePassword(password);

    const errors = [];
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    }
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      data: errors.length === 0 ? { email, password } : null
    };
  }

  /**
   * Performs login with validation
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} Login result
   */
  async login(email, password) {
    const validation = this.validate(email, password);

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }

    // Simulate authentication (replace with actual authentication logic)
    try {
      // In a real application, this would call an authentication service
      const authenticated = await this.authenticate(validation.data);
      
      if (authenticated) {
        return {
          success: true,
          message: 'Login exitoso',
          user: {
            email: email
          }
        };
      } else {
        return {
          success: false,
          errors: ['Credenciales inválidas']
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: ['Error al procesar el login: ' + error.message]
      };
    }
  }

  /**
   * Simulates authentication (replace with actual authentication logic)
   * @param {object} credentials - User credentials
   * @returns {Promise<boolean>} Authentication result
   */
  async authenticate(credentials) {
    // Simulate async authentication call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a mock - replace with actual authentication logic
        // For demo purposes, any valid email/password combination returns true
        resolve(true);
      }, 500);
    });
  }
}

export default LoginComponent;
