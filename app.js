//Import Packages
const express = require('express');
const errorHandler = require("./middleware/error")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
const mongoose = require("mongoose");

//swagger import
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config()

//Initialize Express
const app = express();

//Import middleware
app.use(express.json());
app.use(cookieParser());

//DB Connection
mongoose.connect(process.env.MONGODB_URL)
.then(()=> console.log("database is connected"))

// route import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);


//swagger import
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// middleware for error
app.use(errorHandler)

//Start Server
app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost: ${process.env.PORT}` )
})

module.exports = app;
