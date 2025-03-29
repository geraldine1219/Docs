const nodemailer = require('nodemailer');

// Configuración del transporte de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'healineoficial@gmail.com',
        pass: 'healineoficial123456789'
    }
});

// Función para enviar correo de recuperación de contraseña
async function enviarCorreoRecuperacion(emailForRecovery, token) {
    try {
        // Contenido del correo electrónico
        const mailOptions = {
            from: 'healineoficial@gmail.com',
            to: emailForRecovery,
            subject: 'Recuperación de Contraseña',
            text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:4200/reset-password?token=${token}`
        };

        // Enviar correo electrónico
        await transporter.sendMail(mailOptions);
        
        console.log('Correo electrónico enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo de recuperación de contraseña:', error);
        throw new Error('Error al enviar el correo de recuperación de contraseña');
    }
}


module.exports = { enviarCorreoRecuperacion };
