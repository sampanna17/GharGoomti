
import "./ListProperty.scss";
import { listData } from "../../lib/dummydata";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/card";
import Map from "../../components/map/Map";
import { useEffect, useState } from 'react';
import axios from 'axios';

function ListPage() {
    const [properties, setProperties] = useState([]);
    
    useEffect(() => {
        const getAllProperties = async() => {
            try {
                const response = await axios.get('http://localhost:8000/api/properties');
                
                // Group images by propertyID
                const groupedProperties = response.data.reduce((acc, current) => {
                    const existingProperty = acc.find(p => p.propertyID === current.propertyID);
                    
                    if (existingProperty) {
                        // If property exists, just add the image to its images array
                        existingProperty.images.push({
                            imageID: current.imageID,
                            imageURL: current.imageURL
                        });
                    } else {
                        // If property doesn't exist, create new entry with first image
                        acc.push({
                            ...current,
                            images: [{
                                imageID: current.imageID,
                                imageURL: current.imageURL
                            }]
                        });
                    }
                    return acc;
                }, []);
                
                console.log(groupedProperties);
                setProperties(groupedProperties);
            } catch (error) {
                console.error(error);
                setProperties(listData);
            }
        };

        getAllProperties();
    }, []);

    return (
        <div className="listPage">
            <div className="listContainer">
                <div className="wrapper">
                    {properties.map(property => (
                        <Card key={property.propertyID} item={property} />
                    ))}
                </div>
            </div>  
            <div className="mapContainer mt-20">
                <Filter />
                <Map items={properties} />
            </div>
        </div>
    );
}

export default ListPage;