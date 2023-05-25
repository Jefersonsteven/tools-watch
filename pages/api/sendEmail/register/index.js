import transporter from "..";
import findUser from "../findUser";

export default async function registerUserEmail(req, res) {
  const { method } = req;
  if (method == "POST") {
    const { email, password } = req.body;
    try {
      const user = await findUser(email)
      if (user) {
        await transporter.verify();
        const mail = {
          from: process.env.USER_APPLICATION,
          to: email,
          subject: "Registro exitoso",
          html: `
          <p>Estimado usuario, sus credenciales de acceso a ToolMatch son las siguientes: <br>
          Usuario: ${email} <br>
            Contraseña: ${password} <br>
            Atentamente, el equipo de ToolMatch
            </p>
            `,
        };
        await transporter.sendMail(mail);
        res.status(200).json({
          Alert: `Se ha enviado un correo electrónico a ${email} con sus credenciales de acceso a ToolMatch`,
        });
      }
      throw new Error("El usuario no existe");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
