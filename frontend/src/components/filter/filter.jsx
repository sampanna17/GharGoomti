
import { useState, useEffect } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import search from '../../assets/ListPage/search.png';

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    address: searchParams.get("address") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  useEffect(() => {
    setSearchParams({});
    setQuery({
      type: "",
      address: "",
      property: "",
      minPrice: "",
      maxPrice: "",
      bedroom: "",
    });
  }, []);


  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    const cleanedQuery = Object.fromEntries(
      Object.entries(query).filter(([, v]) => v !== "")
    );
    setSearchParams(cleanedQuery);
  };

  return (
    <div className="filter">
      <h1>
        Search results for <b>{query.address || "all locations"}</b>
      </h1>
      <form onSubmit={handleFilter}>
        <div className="top">
          <div className="item">
            <label htmlFor="address">Location</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              value={query.city}
            />
          </div>
        </div>
        <div className="bottom">
          <div className="item">
            <label htmlFor="type">Type</label>
            <select
              name="type"
              id="type"
              onChange={handleChange}
              value={query.type}
            >
              <option value="">any</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="property">Property</label>
            <select
              name="property"
              id="property"
              onChange={handleChange}
              value={query.property}
            >
              <option value="">any</option>
              <option value="Apartment">Apartment</option>
              <option value="Building">Building</option>
              <option value="Flat">Flat</option>
            </select>
          </div>
          <div className="item">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="any"
              onChange={handleChange}
              value={query.minPrice}
            />
          </div>
          <div className="item">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="any"
              onChange={handleChange}
              value={query.maxPrice}
            />
          </div>
          <div className="item">
            <label htmlFor="bedroom">Bedroom</label>
            <input
              type="number"
              id="bedroom"
              name="bedroom"
              placeholder="any"
              onChange={handleChange}
              value={query.bedroom}
            />
          </div>
          <button type="submit">
            <img src={search} alt="Search" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Filter;
