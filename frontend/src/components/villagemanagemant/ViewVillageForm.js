import React from "react";
import { gql, useQuery } from "@apollo/client";
import "../../syles/view.css"
 const GET_VILLAGE = gql`
  query GetVillage($id: ID!) {
    village(id: $id) {
      id
      name
      region
      land_area
      latitude
      longitude
      image
      population
    }
  }
`;


const ViewVillageForm = ({ villageId, onClose }) => {
  const { loading, error, data } = useQuery(GET_VILLAGE, {
    variables: { id: villageId },
  });


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching village data.</p>;

  const village = data.village;
  if (!village) return <p>No data found for the provided village ID.</p>;

  return (
    <div class="ov ov2 overlay">
      <div class="form1">
      <form>
      <button type="button" className="close" onClick={onClose} title="Close">
            x
          </button>
      <h2>Village Details</h2>
      <p>Village Name: {village.name}</p>
<p>Region/District: {village.region}</p>
<p>Land Area (sq km): {village.land_area} sq km</p>
<p>Latitude: {village.latitude}</p>
<p>Longitude: {village.longitude}</p>
<p>Population: {village.population}</p>


      </form>
    </div>
    </div>
  );
};

export default ViewVillageForm;
