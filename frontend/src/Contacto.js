import emailjs from "emailjs-com";
import { useSelector } from "react-redux";

export default function Contacto() {

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    function sendEmail(e) {
        e.preventDefault();
        emailjs.sendForm('service_ehpi6v9', 'template_b3rdkf5', e.target, 'user_rV8QRiqSHPrul084aSGPh')
            .then((result) => {
                alert('Mensaje Enviado!. Gracias por contactarnos.');
            }, (error) => {
                alert(error.text);
            });
        e.target.reset()
    };

    return (
        <div>
            <form className="form" id="form-contacto" onSubmit={sendEmail}>
                <div className="form-title">
                    <h1 className="grueso">Escribenos</h1>
                </div>
                <div className="inputDiv">
                    <label>Nombre</label>
                    <input type="text" defaultValue={userInfo?.name} name="from_name" required autoComplete="off"></input>
                </div>
                <div className="inputDiv">
                    <label>Email</label>
                    <input type="text" defaultValue={userInfo?.email} name="from_email" required autoComplete="off"></input>
                </div>
                <div className="inputDiv">
                    <label>Telefono</label>
                    <input type="text" placeholder="ingresa 1 o 2 telefonos" name="telefono" required autoComplete="off"></input>
                </div>
                <div className="inputDiv">
                    <label>Asunto</label>
                    <input type="text" name="subject" required autoComplete="off"></input>
                </div>
                <div className="texto">
                    <textarea id="" cols="30" rows="6" placeholder="Escribe tu mensaje aqui....."
                        name="message">
                    </textarea>
                </div>
                <div>
                    <button type="submit" className="primary" value="Enviar">
                        Enviar tu Mensaje
                </button>
                </div>
            </form>
        </div>
    )
}