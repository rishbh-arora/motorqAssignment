import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "../../styles/index.css";
import VehicleFilter from '../filters/VehicleFilter';

export default function VehicleTable() {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const getData = async () => {
        await axios.get(`${process.env.REACT_APP_BACKEND}/api/vehicle`).then((e) => {
            if (e.status === 200) {
                e.data.forEach(element => {
                    element.model = element.model.name;
                });
                setData(e.data);
                console.log(data);
            }
        }).catch((e) => {
            console.log(e);
            navigate("/")
        });
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <VehicleFilter setVehicleTable={setData} />
            <div className="table">
                <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="plate" header="Number plate"></Column>
                    <Column field="model" header="Model"></Column>
                </DataTable>
            </div>
        </>
    );
}