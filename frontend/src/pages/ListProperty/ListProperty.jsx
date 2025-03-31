import "./ListProperty.scss";
import { listData } from "../../lib/dummydata"
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/card";
import Map from "../../components/map/Map";
// import { Await, useLoaderData } from "react-router-dom";
// import { Suspense } from "react";


function ListPage() {
    const data = listData;
    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper ">
                    {listData.map(item => (
                        <Card key={item.id} item={item} />
                    ))}
                </div>
            </div>
            <div className="mapContainer mt-20 ">
                <Filter />
                <Map items={data} />
            </div>
        </div>
    );
}

export default ListPage;