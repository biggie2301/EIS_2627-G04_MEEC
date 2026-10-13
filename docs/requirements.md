# System Requirements

This document defines an initial set of requirements for the Courier Management System (CMS).

## 1. Functional Requirements

### Public Access and User Accounts

| ID | Actor | Requirement — the system shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| FR-01 | Visitor | Display a home page with public metrics and service highlights. | The portal displays labelled metrics, service highlights and links to login, registration and the team page. | Static HTML portal with sample metrics and working navigation. |
| FR-02 | Visitor | Allow registration as Client, Courier or Staff, requiring approval for new Courier and Staff accounts. | A valid submission registers the selected role. Courier accounts remain pending until approved by Staff; Staff accounts remain pending until approved by Admin. | Validated registration form and simulated account states. Public role selection is a team proposal. |
| FR-03 | Visitor | Display the academic identification of the project team. | The page includes each member's name, student ID, institutional email and course, together with the team number. | Team HTML page linked from the portal. |
| FR-04 | All authenticated roles | Allow login and logout and redirect users to their role-specific area. | Valid sample credentials open the appropriate page; invalid credentials produce an error. Pending Courier/Staff accounts cannot access operational features. Logout clears the simulated session. | Sample accounts and simulated login/logout, without production authentication. |
| FR-05 | Admin; other roles optional | Allow users to edit their personal information. | The Admin can edit name, email, phone and NIF. Valid changes produce confirmation; invalid required values are rejected. Support for other roles is optional. | Prefilled Admin form with validation and simulated saving; reuse for other roles if time permits. |

### Client

| ID | Actor | Requirement — the system shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| FR-06 | Client | Allow product registration with description, category, weight in kg and volume in m³. | Required fields are completed, and weight and volume are positive numbers. Valid submission adds the product to the displayed list. | Product form, numeric validation and an in-memory product list. |
| FR-07 | Client | Allow creation of an order containing one or more products and origin/destination GPS coordinates. | At least one product is selected. Coordinates are numeric: latitude between -90 and 90 and longitude between -180 and 180. Valid submission confirms the order. | Form using sample products, coordinate validation and simulated order creation. |
| FR-08 | Client | Display a Leaflet/OpenStreetMap map in the order creation form. | The map supports zooming and panning and displays one predefined marker, such as FEUP. Origin/destination markers based on form inputs are optional. | Leaflet map with OpenStreetMap tiles and one marker; two input-driven markers as an optional enhancement. |
| FR-09 | Client | Display the current status of the client's active orders. | Each active order belonging to the sample client is identifiable and has a clearly labelled status. | Order table or cards populated with sample data. |
| FR-10 | Client | Display the client's completed order history. | Completed orders belonging to the sample client are accessible separately from active orders. | Completed-order list populated with sample data. |

### Courier

| ID | Actor | Requirement — the system shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| FR-11 | Courier | Allow vehicle registration with identification, type, capacities, insurance and inspection information. | The form captures plate, model, type, positive maximum weight/volume, document expiry dates and both documents. New vehicles await Staff approval. | Validated vehicle form, file-selection controls and simulated pending status. |
| FR-12 | Courier | Allow selection of an eligible vehicle for an order or consolidated route. | The selected vehicle belongs to the courier, satisfies approval/document rules and has sufficient capacity. The current selection is visible. | Sample vehicle selector connected to capacity and eligibility checks. |
| FR-13 | Courier | Prevent allocation when the selected vehicle lacks sufficient weight or volume capacity. | Allocation is blocked if total cargo weight or volume exceeds either vehicle limit. Consolidated routes include all selected orders in the capacity calculation. | JavaScript checks using sample products, orders and vehicle capacities. |
| FR-14 | Courier | Limit each courier to one active task: one standalone order or one consolidated route. | Starting a second independent task is blocked. Multiple orders are permitted only within the same active consolidated route. | Simulated active-task state and controls that prevent conflicting actions. |
| FR-15 | Courier | Allow multiple selected orders to be consolidated into a single route. | The route groups selected orders under one courier and one eligible vehicle and complies with capacity and single-task rules. | Order multi-selection and simulated route summary, without automatic route optimisation. |
| FR-16 | Courier | Allow order status changes only through Initiated → In Progress → Completed/Cancelled. | Only permitted transitions are available. Completion requires proof of delivery. Cancellation triggers the return-to-availability workflow in FR-18. | JavaScript status controls applied to sample orders. |
| FR-17 | Courier | Require electronic proof of delivery before completing an order. | Completion is blocked without a non-empty Canvas signature or a selected delivery photo. Either accepted evidence type satisfies the requirement. | Canvas signature or photo-selection simulator, validated before completion. |
| FR-18 | Courier | Return a cancelled order to the available-order list. | The cancelled order leaves the active task and appears once in the available list for reassignment. Attempt-counter and reassignment-state rules must be agreed separately. | Simulated list updates; no automatic attempt increment until its meaning is defined. |
| FR-19 | Courier | Display a Leaflet/OpenStreetMap map when viewing an active order. | The active-order view displays an interactive map with the same predefined location used in the client map. | Leaflet map with the predefined marker; dynamic route display subject to scope clarification. |
| FR-20 | Courier | Display the courier's completed orders. | The sample courier can consult their completed orders separately from the active task. | Completed-order table populated with sample data. |
| FR-21 | Courier | Allow couriers to view available orders and select orders for execution. | An approved sample courier can inspect available orders and select one or more for assignment. Execution requires an eligible vehicle and compliance with FR-13 to FR-15. | Available-order list with selection controls and simulated assignment. |

### Staff and Vehicle Eligibility

| ID | Actor | Requirement — the system shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| FR-22 | Staff | List pending courier accounts and allow their validation. | Staff can inspect and approve a pending account, updating its displayed status. Rejection is an optional extension. | Sample account list and simulated approval, with optional rejection. |
| FR-23 | Staff | List pending vehicles and allow approval after insurance and inspection checks. | Staff can inspect vehicle and document information. Approval is blocked when either required document is missing or expired. | Pending-vehicle list, sample document details and simulated approval checks. |
| FR-24 | Staff | Display alerts when insurance or inspection information is updated or expires. | Updated and expired documents have distinct alerts identifying the vehicle and document type. | Sample update indicators and date comparisons against a documented reference date. |
| FR-25 | Courier / Staff | Prevent allocation or start of a new task using an unapproved vehicle or invalid documentation. | Vehicles cannot be assigned to or start a new task if unapproved, missing required documents or holding expired insurance/inspection documents. | JavaScript eligibility checks and explanatory messages. Mid-route expiry behaviour remains to be defined. |

### Admin

| ID | Actor | Requirement — the system shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| FR-26 | Admin | List pending Staff accounts and allow their approval. | Admin can inspect and approve a pending Staff account. Its status changes, enabling simulated Staff access. | Pending-account list and simulated approval. |
| FR-27 | Admin | Display operational KPIs for clients, couriers, Staff, orders and routes. | Labelled totals and order/route counts by status agree with the sample dataset. | Dashboard cards, tables or simple charts derived from sample data. |
| FR-28 | Admin — optional | Display delivery trends and cancellation-rate charts. | Delivery counts use a labelled period. The cancellation rate states its numerator, denominator and period and handles a zero denominator. | Optional charts based on sample data, after the core requirements are complete. |


## 2. Non-Functional Requirements

| ID | Category | Requirement — the system or project shall… | Acceptance Criteria | Sprint 1 Implementation |
| --- | --- | --- | --- | --- |
| NFR-01 | Technology constraint | Implement the frontend using HTML5, CSS3 and JavaScript. No additional frontend framework is required by the specification. | The submitted source includes HTML pages, CSS stylesheets and JavaScript for the required interactions and validations. | Interconnected HTML documents, shared CSS files and JavaScript files. |
| NFR-02 | Responsiveness | Provide an interface usable on desktop and mobile screens. | At viewport widths of 375 px and 1366 px, essential content and controls remain accessible without overlapping or clipping. Wide tables may scroll within their containers. | Responsive layouts, media queries and manual checks at both viewport widths. |
| NFR-03 | Usability and visual consistency | Maintain a clear visual hierarchy and consistent navigation across all pages. | Each page has an identifiable main heading. Pages sharing a layout use consistent typography, colours, buttons and navigation placement. Navigation labels are clear, and internal links lead to their intended destinations. | Shared styles and layout conventions, followed by visual and navigation checks. |
| NFR-04 | Mapping technology constraint | Use Leaflet.js with OpenStreetMap tiles for the required interactive maps. | Both the client order form and the courier active-order view render maps using Leaflet.js and OpenStreetMap tiles, with visible attribution. | Leaflet integration in both interfaces, including the required marker and map controls. |
| NFR-05 | Browser compatibility | Support the stable versions of Chrome, Safari and Firefox selected and recorded for testing. | Navigation, form validation, responsive layouts and map interactions work without blocking defects in all three recorded browser versions. | Manual browser checks, recording browser version, operating system and results. Safari verification requires access to a suitable Apple device or browser-testing service. |
| NFR-06 | Development process constraint | Use Git and GitHub for version control, with the repository named EIS_2627-G04_MEEC and meaningful contributions from every team member. | The repository has the required name. Its history identifies meaningful contributions from each member across the project, including both sprints. | Shared repository with individual contributions, descriptive commit messages and periodic history reviews. Task branches and pull requests are the team's proposed workflow. |
| NFR-07 | Security and data handling | Store real account passwords only as password hashes when persistent authentication is implemented. | The conceptual model includes password_hash. In a future backend implementation, plaintext passwords are not persisted. The Sprint 1 prototype uses fictitious test credentials and does not persist passwords entered into its forms. | Include password_hash in the conceptual model and simulate authentication with fictitious data. Production password processing is outside Sprint 1. |
| NFR-08 | Demonstrability and test data | Include sufficient fictitious sample data to demonstrate every required page and its relevant states. | The submitted project includes sample users, products, vehicles, orders and routes. Data demonstrates active/completed orders, pending approvals, valid/expired documents and dashboard indicators. | Bundled sample data and a short README explaining how to access the demonstration profiles and scenarios. |

