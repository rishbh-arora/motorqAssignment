import axios from 'axios';
// import React, { useEffect, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

const VehicleFilter = ({ setVehicleTable }) => {

    const handleVehicleFilter = async (e) => {
        const plate = document.getElementById("plate").value;
        const model = document.getElementById("model").value;
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/vehicle?plate=${plate}&model=${model}`).then((e) => {
            e.data.forEach(element => {
                element.model = element.model.name;
            });
            setVehicleTable(e.data);
        }).catch((e) => {
            console.log(e);
            setVehicleTable([])
        });
    }

    return (<>
        <div class="filters">
            <div>
                <label for="Plate number">Number plate: </label>
                <InputText id="plate" />
            </div>
            <div>
                <label for="model">Model: </label>
                <InputText id="model" />
            </div>
            <Button label="Filter" onClick={handleVehicleFilter} />
        </div>
    </>)
}

export default VehicleFilter