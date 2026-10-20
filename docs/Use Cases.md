This system will manage the end-to-end lifecycles of parcel deliveries, fleet assets, and logistics personnel. The system coordinates interactions across five core user roles: Guests, Clients, Couriers, Staff and Administrators (for now on, refer as Admin). It enforces physical load constraints and regulatory compliance across all operations.

## Actors

- Guest
- Client
- Couriers
- Staff
- Admin

## Use cases

  | ID | Actor | Use case | Associeted Requirements|
  | --- | --- | --- | --- |
  | UC-01 | Guest | Access home page | GUE-01 |
  | UC-02 | Guest | Access login page | GUE-02; GUE-03 |
  | UC-03 | Guest | Access page with identification of all group members | GUE-04 |
  | UC-04 | Client | Register products (category, weight, volume) | CLI-01 |
  | UC-05 | Client | Place orders specifying Origin and Destination locations using individual GPS coordinates (Latitude and Longitude) | CLI-02; CLI-03 |
  | UC-06 | Client | Access the status of an active order | CLI-04 |
  | UC-07 | Client | Access completed orders (historic data) | CLI-05 |
  | UC-08 | Courier | Register vehicle (model, capacity, documents, plate) | COU-01 |
  | UC-09 | Courier | Select appropriate vehicle for that order | COU-02; COU-03 |
  | UC-10 | Courier | Selects and executes one route/order at a time ('single active task' constraint) | COU-04; COU-10 |
  | UC-11 | Courier | Consolidate multiple active orders into a single route | COU-05 |
  | UC-12 | Courier | View completed orders (order history) | COU-11 |
  | UC-14 | Courier | Transition order status sequentially | COU-06 |
  | UC-15 | Courier | Submit the mandatory Electronic Proof of Delivery (e-POD) | COU-07 |
  | UC-16 | Courier | Cancel delivery | COU-08 |
  | UC-17 | Courier | Access OpenStreetMap when viewing active orders | COU-09 |
  | UC-18 | Staff | Validate courier accounts  | STF-01 |
  | UC-19 | Staff | Approve individual vehicles before allocation | STF-02; STF-03; STF-04 |
  | UC-20 | Staff | Receive an alert when the information is updated/outdated | STF-03 |
  | UC-21 | Admin | Validating new staff members | ADM-01 |
  | UC-22 | Admin | Access a statistics dashboard | ADM-02 |
  | UC-23 | All | Edit their account details | CLI-06; COU-12; STF-05; ADM-03 |

