#SuitePortal<br />
SuitePortal is a web application that allows residents of a building to submit maintenance requests for their units and enables admins to manage these requests.<br />

#Features<br />
Residents can submit maintenance requests without logging in<br />
Admins can log in to view and manage open maintenance requests<br />
Responsive design for both desktop and mobile use<br />

**Technology Stack<br />
LowDB: Local Database<br />
Express.js: Backend framework<br />
Angular: Frontend framework<br />
Node.js: Runtime environment<br />

**Usage<br />

**Residents<br />

Navigate to the home page to submit a maintenance request<br />
Fill out the form with the required information<br />
Submit the form to create a new maintenance request<br />

**Admins<br />

Navigate to /admin to access the admin login page<br />
Log in with admin credentials<br />
View the list of open maintenance requests<br />
Close maintenance requests as they are resolved<br />

**API Endpoints<br />

POST /api/maintenance-requests: Create a new maintenance request<br />
GET /api/maintenance-requests: Get all open maintenance requests (admin only)<br />
PUT /api/maintenance-requests/:id/close: Close a specific maintenance request (admin only)<br />
POST /api/admin/login: Admin login<br />

**Unit Testing (frontent)<br />
Using jest testing framework on client side unit testing, maintaining 70-80% of code coverage.

