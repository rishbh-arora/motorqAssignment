import React, { useState } from 'react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "../styles/index.css"
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import DriverTable from './tables/driverTable';
import VehicleTable from './tables/vehicleTable';
import BookingTable from './tables/bookingTable';
import { Button } from 'primereact/button';


const Dashboard = ({ menus, changeMenu }) => {

    const navigate = useNavigate();
    const panels = [
        { "name": "Drivers", code: 0 },
        { "name": "Vehicles", code: 1 },
        { "name": "Bookings", code: 2 },
    ]
    const [display, setDisplay] = useState(panels[0]);

    const handleMenuChange = (e) => {
        if (e.value.name === "Metrics") {
            navigate("/metrics");
        }
    }

    return (
        <>
            <div class="container">
                <div class="panel">
                    <div className="menu">
                        <Dropdown value="Dashboard" onChange={handleMenuChange} options={menus} optionLabel="name"
                            placeholder="Select menu" className="mainMenu" />
                        <Dropdown value={display} onChange={(e) => { setDisplay(e.value); }} options={panels} optionLabel="name"
                            placeholder="Select menu" className="mainDrop" />
                    </div>
                    <div>
                        {display.name === "Drivers" ? <DriverTable></DriverTable> : null}
                        {display.name === "Vehicles" ? <VehicleTable></VehicleTable> : null}
                        {display.name === "Bookings" ? <BookingTable></BookingTable> : null}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100vw', marginTop: '5vh' }}>
                        {display.name === "Drivers" ? <Button label="Create Driver" onClick={(e) => navigate("/driver")} /> : null}
                        {display.name === "Vehicles" ? <Button label="Create Vehicle" onClick={(e) => navigate("/vehicle")} /> : null}
                        {display.name === "Bookings" ? <Button label="Create Booking" onClick={(e) => navigate("/booking")} /> : null}
                    </div>
                </div>
            </div>
            <div class="container">

            </div>
        </>
    )
}

export default Dashboard;