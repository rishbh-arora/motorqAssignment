import axios from 'axios';
// import React, { useEffect, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

const DriverFilters = ({ setDriverTable }) => {

    const handleDriverFilter = async (e) => {
        const name = document.getElementById("name").value;
        const contact = document.getElementById("contact").value;
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/driver?name=${name}&phone=${contact}`).then((e) => {
            setDriverTable(e.data);
        });
    }

    return (<>
        <div class="filters">
            <div>
                <label for="name">Name: </label>
                <InputText id="name" />
            </div>
            <div>
                <label>Contact: </label>
                <InputText id="contact" />
            </div>
            <Button label="Filter" onClick={handleDriverFilter} />
        </div>
    </>)
}

export default DriverFilters