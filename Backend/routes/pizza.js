const express = require("express");
const { createPizza, fetchAllPizza, priceCalculator, placeOrder, getMyOrders, getOrders, deleteOrder } = require("../controllers/Pizza");
const { createVeggies, fetchAllVeggies, addVeggies } = require("../controllers/Veggies");
const { createSauce, fetchAllSauce, addSauce } = require("../controllers/Sauce");
const { createBase, fetchAllBase, addBase } = require("../controllers/Base");
const { createCheese, fetchAllCheese, addCheese } = require("../controllers/Cheese");
const { autht, isAdmin, isCustomer } = require("../middleware/auth");
const router = express.Router();

//Pizza Routes
router.post("/addPizza", autht, createPizza);
router.get("/getAllPizza", fetchAllPizza);
router.post("/customerCreation", autht, isCustomer, priceCalculator)
router.post("/placeOrder", autht, isCustomer, placeOrder)
router.get("/getMyOrders",autht, isCustomer, getMyOrders)
router.get("/getOrders", autht, isAdmin, getOrders)
router.post('/deleteOrder', deleteOrder)

//Veggies Routes
router.post("/createVeggies", autht, isAdmin, createVeggies);
router.get("/getAllVeggies", fetchAllVeggies);
router.post("/addVeggies", autht, isAdmin, addVeggies);

//Sauce Routes
router.post("/createSauce", autht, isAdmin, createSauce);
router.get("/getAllSauce", fetchAllSauce);
router.post("/addSauce", autht, isAdmin, addSauce);

//Base Routes
router.post("/createBase", autht, isAdmin, createBase);
router.get("/getAllBase", fetchAllBase);
router.post("/addBase", autht, isAdmin, addBase);

//Cheese Routes
router.post("/createCheese", autht, isAdmin, createCheese);
router.get("/getAllCheese", fetchAllCheese);
router.post("/addCheese", autht, isAdmin, addCheese);

module.exports = router;