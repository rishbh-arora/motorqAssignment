import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../styles/index.css"
import DriverFilters from '../filters/driverFilters';

export default function DriverTable() {
    const [data, setData] = useState([]);
    const getData = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/driver`).then((e) => {
            if (e.status === 200) {
                setData(e.data);
            }
        });
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <DriverFilters setDriverTable={setData} />
            <div className="table">
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="name" header="Name"></Column>
                    <Column field="location" header="Location"></Column>
                    <Column field="phone" header="Phone No"></Column>
                </DataTable>
            </div>

        </>
    );
}