# Requirements

## General Requirements

| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| GUE - 01 | Guest | Home Overview | Displays metrics, service highlights, and unified access links to login and registration | **Home Page:** Static HTML/CSS landing page | ... |
| GUE - 02 | Guest | User Authentication & Registration | Dedicated area for users to login or sign up, specifying their role | **Login/ Sign up Page:** Static HTLM/CSS forms with JavaScript validation|||||
| GUE - 03 | Guest | Role-Based Redirection & Session Control | Valid credentials redirect users to their role-specific area; unapproved accounts are blocked from operational features, and logout clears the session | **Login / Session Handler:** Simulated login/logout routing logic |
| GUE - 04 | Guest | Team Information & Academic Metadata | Displays full academic identification of all group members (Name, student ID, institutional email, course, team number) | **Team Page:** Static informational page |

## Client Requirements

| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| CLI - 01 | Client | Product Registration | Clients can register products specifying description, category, weight in kg, and volume in $m^3$ | **Client Page:** Product submission form with numeric validation |
| CLI - 02 | Client | Order Creation with GPS Coordinates | Clients can place orders containing one or more products specifying Origin and Destination using individual GPS coordinates (Latitude and Longitude) | **Client Page:** Order submission form with coordinate input fields |
| CLI - 03 | Client | Interactive Order Creation Map | The order creation form must feature an embedded interactive Leaflet.js map container rendering markers (e.g., FEUP) | **Client Page:** Embedded Leaflet.js map container |
| CLI - 04 | Client | Active Order Status Tracking | Clients can view the current status of their active delivery orders | **Client Page:** Status section displaying accepted order states |
| CLI - 05 | Client | Historical Orders Access | Clients can consult historical records of their past and completed order | **Client Page:** Static history table/list prototype with sample data |

## Courier Requirements
| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| COU - 01 | Courier | Vehicle Registration & Documentation | Couriers can register vehicles capturing plate, model, type, capacities, and document expiry dates/files. New vehicles await Staff approval. | **Courier Page:** Validated vehicle form with file-selection controls |
| COU - 02 | Courier | Vehicle Selection & Capacity Matching | Couriers can select an appropriate vehicle for an order that accommodates the cargo's weight and volume limits | **Courier Page:** Active vehicle selector component |
| COU - 03 | Courier | Vehicle Capacity Validation Constraints | Allocation is blocked if total cargo weight or volume exceeds vehicle limits. Consolidated routes include all selected orders in the check | **Courier Page:** JavaScript validation checks using vehicle limits and cargo data |
| COU - 04 | Courier | Single Active Task & Route Execution | Couriers execute one route/order at a time ("single active task") or consolidate multiple active orders into a single route | **Courier Page:** Route management and task selection interface |
| COU - 05 | Courier | Multi-Order Route Consolidation | Multiple selected orders can be grouped under one courier and one eligible vehicle, complying with single-task and capacity rules. | **Courier Page:** Order multi-selection and route summary interface |
| COU - 06 | Courier | Sequential Order Status Transitions | Couriers can transition order statuses sequentially (returning cancelled orders to the pool) | **Courier Page:** Sequential status transition buttons |
| COU - 07 | Courier | Electronic Proof of Delivery (e-POD) | Upon order completion, couriers must submit mandatory e-POD consisting of a digital Canvas signature or delivery photo | **Courier Page:** Signature canvas or photo upload simulator |
| COU - 08 | Courier | Cancelled Order Return to Pool | When an order is cancelled, it leaves the active task and returns to the available order list for reassignment | **Courier Page:** Simulated list update routine |
| COU - 09 | Courier | Interactive Navigation Cockpit Map | When viewing active orders, the system displays the OpenStreetMap container with markers (e.g., FEUP marker) | **Courier Page:** Embedded interactive map container |
| COU - 10 | Courier | Available Orders Inspection & Selection | Approved couriers can inspect the list of available orders and select one or more for execution, subject to eligibility rules | **Courier Page:** Available-order list with assignment selection controls |
| COU - 11 | Courier | Completed Orders Log Access | Couriers can consult their history of completed orders | **Courier Page:** Completed orders history log |

## Staff Requirements
| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| STF - 01 | Staff | Courier Account Validation | Backoffice staff can review and validate new courier account registrations | **Staff Page:** Pending courier approvals section |
| STF - 02 | Staff | Vehicle Auditing & Certificate Approval | Staff audit and approve individual vehicles before allocation, verifying valid insurance and inspection certificates/documents | **Staff Page:** Vehicle approval list |
| STF - 03 | Staff | Vehicle Expiry & Update Alerts | Staff receive visual alerts when vehicle information is updated, or when inspection/insurance certificates become outdated | **Staff Page:** Visual alert badges for expired/updated certificates |
| STF - 04 | Staff | Unapproved or Expired Asset Prevention | Vehicles and tasks cannot be assigned or started if the vehicle is unapproved, missing required documents, or holding expired insurance/inspection certificates | **Global Logic:** Eligibility checks and explanatory status messages. |

## Admin Requirements
| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| ADM - 01 | Admin | Staff Account Validation | Administrators can review and validate new staff member registrations | **Admin Page:** Pending staff approvals section |
| ADM - 02 | Admin | Operational KPI Analytics Dashboard | Admins have access to a dashboard displaying system statistics including counts of couriers, staff, clients, and route statistics | **Admin Page:** Operational KPI metrics and analytics dashboard view |
| ADM - 03 | Admin | Personal Information Management | Admins can edit their personal account details | **Admin Page:** Account settings/edit interface |

## System (Non - functional) Requirements
| ID | ACTOR | REQUIREMENT | ACCEPTANCE CRITERIA | IMPLEMENTATION |
| --- | --- | --- | --- | --- |
| SYS - 01 | System | Conceptual ER Model Architecture | Teams must design a normalized Entity-Relationship (ER) conceptual model covering core domain entities: User, Vehicle, Vehicle_Type, Product, Order, and Route status | **Documentation**: High-resolution ER diagram image and academic report |
| SYS - 02 | System | Client-Side Form Validation Constraints | Empty required fields must prevent form submission and display popup/text error alerts via JavaScript | **Global JS Scripts:** Form validation logic integrated across all input form |
| SYS - 03 | System | Frontend Prototype Design & Responsiveness | The static frontend must feature responsive design, professional visual hierarchy, and fluid inter-page navigation using HTML5 and CSS3 | **Global CSS/HTML Files:** Responsive stylesheets and multi-page layout |
| SYS - 04 | System | Cross-Browser Compatibility | Navigation, form validation, responsive layouts, and map interactions work without blocking defects across stable versions of Chrome, Safari, and Firefox | **Testing Protocol:** Manual testing records across target browser versions |
| SYS - 05 | System | Demonstrability & Test Data Bundling | The submission must include sufficient fictitious sample data to demonstrate every required page, active/completed states, and approval workflows | **Source Package:** Bundled test dataset and README usage instructions |
| SYS - 06 | System | Version Control & Repository Naming | Development must use Git and GitHub with a repository name matching the convention EIS_2627-GXXX_MXXX | **GitHub Repository:** Structured commits across team members |