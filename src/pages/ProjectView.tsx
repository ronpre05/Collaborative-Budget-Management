import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import GoodsServicesCosts from "./GoodsServicesCosts";
import PersonnelCosts from "./PersonnelCosts";
import EquipmentCosts from "./EquipmentCosts";
import TravelCosts from "./TravelCosts";
import { readJsonFile, getCategoriesSection, getCategoryNames } from "../templateParser";
import { checkAndAddCategories } from "../database";

async function categoryCheck(){
  // Get template categories
  let templateData = await readJsonFile("./template1.json");
  // Check against stored values in db
  let categoryList = getCategoriesSection(templateData);
    // If present, return
  let categoryNames = getCategoryNames(categoryList);
  
  // Check for missing categories and add any missing ones
  await checkAndAddCategories(categoryNames);
}

const ProjectView: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    categoryCheck();
  });

  return (
    <div className="create-project-content">
      <h1>Create Project</h1>

      <div className="tab-container">
        <Link
          to="/create-project/personnel-costs"
          className={`tab ${location.pathname === "/create-project/personnel-costs" ? "active-tab" : ""}`}
        >
          Personnel Costs
        </Link>
        <Link
          to="/create-project/equipment-costs"
          className={`tab ${location.pathname === "/create-project/equipment-costs" ? "active-tab" : ""}`}
        >
          Equipment Costs
        </Link>
        <Link
          to="/create-project/travel-costs"
          className={`tab ${location.pathname === "/create-project/travel-costs" ? "active-tab" : ""}`}
        >
          Travel Costs
        </Link>
        <Link
          to="/create-project/goods-services-costs"
          className={`tab ${location.pathname === "/create-project/goods-services-costs" ? "active-tab" : ""}`}
        >
          Goods/Services Costs
        </Link>
      </div>

      <div className="tab-content">
        {location.pathname === "/create-project/personnel-costs" && <PersonnelCosts />}
        {location.pathname === "/create-project/equipment-costs" && <EquipmentCosts />}
        {location.pathname === "/create-project/travel-costs" && <TravelCosts />}
        {location.pathname === "/create-project/goods-services-costs" && <GoodsServicesCosts />}

        {location.pathname === "/create-project" && (
          <p>Select a cost category using the tabs above.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
