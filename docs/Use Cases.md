This system will manage the end-to-end lifecycles of parcel deliveries, fleet assets, and logistics personnel. The system coordinates interactions across four core user roles: Clients, Couriers, Staff and Administrators (for now on, refer as Admin). It enforces physical load constraints and regulatory compliance across all operations.

## Actors

- Client
- Couriers
- Staff
- Admin

## Use cases
### Clients

- Request delivery services
- Register products and place orders specifying Origin and Destination locations using individual GPS coordinates (Latitude and Longitude)
- Access the status of an active order
- Access completed orders (historic data)

### Couriers

- Select appropriate vehicle for that order
- Selects and executes one route/order at a time ('single active task' constraint) can consolidate multiple active orders into a single route
- View completed orders
- Transition order status sequentially
- Submit the mandatory Electronic Proof of Delivery (e-POD)
- Consult order history


### Staff

- Validate courier accounts 
- Approve individual vehicles before allocation
- Receive an alert when the information is updated/outdated


### Admin

- Validating new staff members
- Access also to a dashboard


