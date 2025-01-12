import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "../../syles/view.css";
import AddVillageForm from "./AddVillageForm";
import UpdateVillageForm from "./UpdateVillageForm";
import ViewVillageForm from "./ViewVillageForm";
import DemographicDataForm from "./DemographicDataForm";
import CustomDropdown from "./CustomDropdown";
import { jwtDecode } from "jwt-decode";

// GraphQL Queries & Mutations
const GET_VILLAGES = gql`
  query GetVillages {
    villages {
      id
      name
      region
      land_area
      latitude
      longitude
      image
      tags
      population
      population_distribution
      gender_ratios
      population_growth_rate
    }
  }
`;

const DELETE_VILLAGE = gql`
  mutation DeleteVillage($id: ID!) {
    deleteVillage(id: $id)
  }
`;

const VillageManagement = () => {
  const { loading, error, data, refetch } = useQuery(GET_VILLAGES);
  const [deleteVillage] = useMutation(DELETE_VILLAGE, {
    refetchQueries: [{ query: GET_VILLAGES }],
  });

  const getUserDataFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const [currentView, setCurrentView] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const villagesPerPage = 5;

  const userData = getUserDataFromToken();
  const userRole = userData?.role;

  
  if (loading) return <p>Loading villages...</p>;
  if (error) return <p>Error: {error.message}</p>;

  let villages = data.villages;

  // Filter and sort villages
  const filteredVillages = villages.filter((village) =>
    village.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedVillages =
    sortBy === "alphabetical"
      ? [...filteredVillages].sort((a, b) => a.name.localeCompare(b.name))
      : filteredVillages;

  // Pagination logic
  const totalPages = Math.ceil(sortedVillages.length / villagesPerPage);
  const startIndex = (currentPage - 1) * villagesPerPage;
  const paginatedVillages = sortedVillages.slice(
    startIndex,
    startIndex + villagesPerPage
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this village?")) {
      try {
        await deleteVillage({ variables: { id } });
        alert("Village deleted successfully!");
      } catch (err) {
        alert("Error deleting village: " + err.message);
      }
    }
  };

  return (
    <section id="Village-Management" className="section">
      <div className="header">
      {userRole === "admin" && (
        <button className="but1" onClick={() => setCurrentView("add")}>
          Add New Village
        </button>
)}
      </div>

      <div className="div1">
        <h4>View Village List</h4>

        {/* Search */}
        <input
          type="text"
          placeholder="Search villages..."
          className="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Sorting */}
        <div className="container">
          <label className="labl">Sort by:</label>
          <CustomDropdown sortBy={sortBy} setSortBy={setSortBy} />

          {/* Pagination */}
          <div className="pag">
            <label>Page:</label>
            <button
              className="prev-next"
              id="prev-button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span id="page-info">
              {currentPage} / {totalPages}
            </span>
            <button
              className="prev-next"
              id="next-button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Village List */}
        <div className="village-items">
          {paginatedVillages.map((village) => (
            <div className="item" key={village.id}>
              <label>
                {village.name} - {village.region}
              </label>
              {userRole === "admin" && (
                <>
                  <button
                    className="but3"
                    onClick={() => {
                      setSelectedVillage(village);
                      setCurrentView("view");
                    }}
                  >
                    View
                  </button>
                  <button
                    className="but2"
                    onClick={() => {
                      setSelectedVillage(village);
                      setCurrentView("update");
                    }}
                  >
                    Update Village
                  </button>
                  <button
                    className="but4"
                    onClick={() => handleDelete(village.id)}
                  >
                    Delete Village
                  </button>
                  <button
                    className="but5"
                    onClick={() => {
                      setSelectedVillage(village);
                      setCurrentView("demographic");
                    }}
                  >
                    Add Demographic Data
                  </button>
                </>
              )}

              {userRole === "user" && (
                <button
                  className="but3"
                  onClick={() => {
                    setSelectedVillage(village);
                    setCurrentView("view");
                  }}
                >
                  View
                </button>
              )}
            </div>
          ))}
        </div>

        {currentView === "add" && (
          <AddVillageForm onClose={() => setCurrentView(null)} refreshVillages={refetch} />
        )}

        {currentView === "view" && selectedVillage && (
          <ViewVillageForm
            villageId={selectedVillage.id}
            onClose={() => setCurrentView(null)}
          />
        )}

        {currentView === "update" && selectedVillage && (
          <UpdateVillageForm
          villageId={selectedVillage}
            onClose={() => setCurrentView(null)}
          />
        )}

        {currentView === "demographic" && selectedVillage && (
          <DemographicDataForm
          villageId={selectedVillage.id}
            onClose={() => setCurrentView(null)}
          />
        )}
      </div>
    </section>
  );
};

export default VillageManagement;
