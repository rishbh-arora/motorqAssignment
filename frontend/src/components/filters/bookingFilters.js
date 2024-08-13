import axios from 'axios';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

const BookingFilter = ({ setBookingTable }) => {

    const handleBookingFilter = async (e) => {
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/driver?name=${name}&phone=${contact}`).then((e) => {
            setBookingTable(e.data);
        });
    }

    return (<>
        <div class="filters">
            <form>
                <div>
                    <label for="name">Name: </label>
                    <InputText id="name" />
                </div>
                <div>
                    <label for="datetime" style={{ marginRight: 1 + 'em' }}>Select Date and Time:</label>
                    <input type="datetime-local" id="datetime" name="datetime"></input>
                </div>
                <div>
                    <label>Contact: </label>
                    <InputText id="contact" />
                </div>
                <Button label="Filter" onClick={handleBookingFilter} />
            </form>
        </div>
    </>)
}

export default BookingFilter;