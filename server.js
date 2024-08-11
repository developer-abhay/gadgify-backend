require("dotenv").config();

const express = require("express");
var cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51OTsmZSGY67LfqYO1SlfXQDTLkQn90GVrURgF9ccBFaQGRFbB5X893xlg1HOPk6ljOFX1SMdd0oazBIrJi4sp8TW00VtU0kB8D"
);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  /*
  req.body.items from frontend post request we will get
  [{
    price_Id: 123,
    count: 567
  }] 
  
  stripe wants 
  [{
    price: 123,
    quantity: 567
  }] 
  */

  const items = req.body.items;
  let lineItems = [];

  items.forEach((item) =>
    lineItems.push({
      price: item.price_Id,
      quantity: item.count,
    })
  );

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:4000/success",
    cancel_url: "http://localhost:4000/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Listening to port 4000"));
