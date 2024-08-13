
import { FormThemeProvider } from 'react-form-component'
import Form, {
    Input,
    FormButton,
} from 'react-form-component'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Message } from 'primereact/message'

const Driver = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState(false);

    const submitForm = async () => {
        console.log({ name, email, phone });
        await axios.post(`${process.env.REACT_APP_BACKEND}/api/driver`, { name, email, phone })
            .then((e) => {
                if (e.status === 200) {
                    setMessage(true);
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);
                } else {
                    console.log(e.message);
                }
            })
            .catch((e) => {
                setMessage(true);
                setTimeout(() => {
                    setMessage(false);
                }, 3000);
            });
    }

    const location = await Geolocation.getCurrentPosition():

    return (
        <>
            <FormThemeProvider>
                <Form fields={['name', 'email', 'phone']}>
                    <Input
                        name='name'
                        type='text'
                        label='Name'
                        onChange={(e) => { setName(e) }}
                    />
                    <Input
                        name='email'
                        type='email'
                        label='E-mail'
                        onChange={(e) => setEmail(e)}
                    />
                    <Input
                        name='phone'
                        type='phone'
                        label='phone'
                        onChange={(e) => setPhone(e)}
                    />
                    <iframe
                        width="600"
                        height="450"
                        loading="lazy"
                        allowfullscreen
                        referrerpolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAtMTajne_9_XlfhmeNopXIqR3Mz-5QRmE
    &q=Space+Needle,Seattle+WA">
                    </iframe>
                    <FormButton onClick={submitForm}>Save</FormButton>
                </Form>
            </FormThemeProvider>
            {message ? <Message text="Driver added!" /> : null}
        </>
    )
}
export default Driver;