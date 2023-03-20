const express = require("express");

const { getAllProducts, 
        createProduct, 
        updateProduct,
        deleteProduct, 
        getSingleProduct
      } = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles}  = require("../middleware/auth");

const router = express.Router()

router.route("/product").get(isAuthenticatedUser, authorizeRoles("admin", "user"), getAllProducts);

router.route("/product").post(isAuthenticatedUser,authorizeRoles("admin",),createProduct);

router.route("/product/:id")
.get(isAuthenticatedUser,authorizeRoles("admin", "user"), getSingleProduct)
.put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct)



module.exports = router;