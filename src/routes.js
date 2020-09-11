// Import required modules
const express = require('express')
const multer = require('multer') // Since we will have routes to thumbnails upload

// Import required controllers and config files
const verifyToken = require('./config/verifyToken')
const uploadToS3 = require('./config/s3Upload');
// const uploadConfig = require('./config/upload')
const UserController = require('./controllers/UserController')
const EventController = require('./controllers/EventController')
const DashboardController = require('./controllers/DashboardController')
const LoginController = require('./controllers/LoginController')
const RegistrationController = require('./controllers/RegistrationController')
const ApprovalController = require('./controllers/ApprovalController')
const RejectionController = require('./controllers/RejectionController')

// Creating instances
// Define middleware which allows us to route from different file and inject into express
const routes = express.Router()

// Multer instance of our upload config to use the functionality
// const upload = multer(uploadConfig)

// Define routes using express Router method
routes.get('/status', (req, res)=> {
    res.send({ status: 200})
})

// Event
// If you access upload config's properties, there are many options.
// We will upload single file so we will use single method
// Afterwards we will call the EventController to create event
routes.post('/event', verifyToken, uploadToS3.single("thumbnail"), EventController.createEvent) 
// Delete event by ID
routes.delete('/event/:eventId', verifyToken, EventController.delete)


// User
// Get events by user ID
routes.get('/user/events', verifyToken, DashboardController.getEventsByUserId)
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

// Dashboard 
// We will create getUserById function in Event Controller and use that here to create and access dynamic route
routes.get('/event/:eventId', verifyToken, DashboardController.getEventById)
// End point to get all events
routes.get('/dashboard', verifyToken, DashboardController.getAllEvents)
// Get events by category
routes.get('/dashboard/:category', verifyToken, DashboardController.getAllEvents)



// Login
routes.post('/login', LoginController.store)

// Registration 
// Create registration
routes.post('/registration/:eventId', verifyToken, RegistrationController.createRegistration)
routes.get('/registration', verifyToken, RegistrationController.getMyRegistrations)
routes.get('/registration/:registrationId', RegistrationController.getRegistration)
// Approvals and Rejections
routes.post('/registration/:registrationId/approvals', verifyToken, ApprovalController.approval)
routes.post('/registration/:registrationId/rejections', verifyToken, RejectionController.rejection)


//TODO: Registration ApprovalController
//TODO: Registration RejectionController

// Export routes
module.exports = routes
