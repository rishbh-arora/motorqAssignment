import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../styles/index.css"
import BookingFilter from '../filters/bookingFilters';

export default function BookingTable() {
    const [data, setData] = useState([]);
    const getData = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/booking`).then((e) => {
            if (e.status === 200) {
                e.data.forEach(element => {
                    element.vehicle = element.vehicle.plate;
                    element.driver = element.driver.name;
                });
                console.log(e.data);
                setData(e.data);
            }
        }).catch((e) => {
            setData([]);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <BookingFilter setBookingTable={setData}></BookingFilter>
            <div className="table">
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="vehicle" header="Number Plate"></Column>
                    <Column field="driver" header="Driver"></Column>
                    <Column field="startStamp" header="Start"></Column>
                    <Column field="endStamp" header="End"></Column>
                </DataTable>
            </div>
        </>
    );
}