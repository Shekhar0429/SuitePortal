#SuitePortal
SuitePortal is a web application that allows residents of a building to submit maintenance requests for their units and enables admins to manage these requests.

#Features
Residents can submit maintenance requests without logging in
Admins can log in to view and manage open maintenance requests
Responsive design for both desktop and mobile use

#Technology Stack
LowDB: Local Database
Express.js: Backend framework
Angular: Frontend framework
Node.js: Runtime environment

#Usage
#Residents

Navigate to the home page to submit a maintenance request
Fill out the form with the required information
Submit the form to create a new maintenance request

#Admins

Navigate to /admin to access the admin login page
Log in with admin credentials
View the list of open maintenance requests
Close maintenance requests as they are resolved

#API Endpoints

POST /api/maintenance-requests: Create a new maintenance request
GET /api/maintenance-requests: Get all open maintenance requests (admin only)
PUT /api/maintenance-requests/:id/close: Close a specific maintenance request (admin only)
POST /api/admin/login: Admin login
