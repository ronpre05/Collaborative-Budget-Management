import { Link, useLocation } from "react-router-dom";
import GoodsServicesCosts from "./GoodsServicesCosts";
import PersonnelCosts from "./PersonnelCosts";


// Creates Project Page
const CreateProject: React.FC = () => {
    const location = useLocation(); // Gets current path
  
    return (
      <div className="create-project-content">
        {
        //Header
        }
        <h1>Create Project</h1>
  
        {
        //Tabs
        }
        <div className="tab-container">
          <Link to="/create-project/personnel-costs" className={`tab ${location.pathname === "/create-project/personnel-costs" ? "active-tab" : ""}`}>
            Personnel Costs
          </Link>
          <Link to="/create-project/equipment-costs" className={`tab ${location.pathname === "/create-project/equipment-costs" ? "active-tab" : ""}`}>
            Equipment Costs
          </Link>
          <Link to="/create-project/travel-costs" className={`tab ${location.pathname === "/create-project/travel-costs" ? "active-tab" : ""}`}>
            Travel Costs
          </Link>
          <Link to="/create-project/goods-services-costs" className={`tab ${location.pathname === "/create-project/goods-services-costs" ? "active-tab" : ""}`}>
            Goods/Services Costs
          </Link>
        </div>
  
        {
        //Tab content
        }
        <div className="tab-content">
          {location.pathname === "/create-project/personnel-costs" && <PersonnelCosts />}
          {location.pathname === "/create-project/equipment-costs" && <h2>Equipment Costs</h2>}
          {location.pathname === "/create-project/travel-costs" && <h2>Travel Costs</h2>}
          {location.pathname === "/create-project/goods-services-costs" && <GoodsServicesCosts />}
          {location.pathname === "/create-project" && <p>Select a cost category using the tabs above.</p>}
        </div>
      </div>
    );
  };

  export default CreateProject;