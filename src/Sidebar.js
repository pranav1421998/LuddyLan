// // Sidebar.js
// import React, { useState } from 'react';
// import './Sidebar';
// const Sidebar = () => {
//   const [activeTab, setActiveTab] = useState('tab1');

//   const handleTabClick = (tab) => {
//     setActiveTab(tab);
//   };

//   return (
//     <div className="sidebar">
//       <div className="tabs">
//         <div
//           className={`tab ${activeTab === 'tab1' ? 'active' : ''}`}
//           onClick={() => handleTabClick('tab1')}
//         >
//           Tab 1
//         </div>
//         <div
//           className={`tab ${activeTab === 'tab2' ? 'active' : ''}`}
//           onClick={() => handleTabClick('tab2')}
//         >
//           Tab 2
//         </div>
//         <div
//           className={`tab ${activeTab === 'tab3' ? 'active' : ''}`}
//           onClick={() => handleTabClick('tab3')}
//         >
//           Tab 3
//         </div>
//       </div>
//       {/* Sidebar content for each tab */}
//       {activeTab === 'tab1' && <div className="tab-content">Tab 1 Content</div>}
//       {activeTab === 'tab2' && <div className="tab-content">Tab 2 Content</div>}
//       {activeTab === 'tab3' && <div className="tab-content">Tab 3 Content</div>}
//     </div>
//   );
// };

// export default Sidebar;
