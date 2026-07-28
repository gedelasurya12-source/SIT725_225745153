const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Recipe Data
const recipes = [
    {
        title: "Chicken Biryani",
        image: "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=600",
        description: "A delicious Indian rice dish cooked with chicken, spices and herbs."
    },
    {
        title: "Veg Pasta",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
        description: "Creamy vegetable pasta loaded with fresh vegetables and herbs."
    },
    {
        title: "Chocolate Cake",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
        description: "Soft and rich chocolate cake perfect for every celebration."
    }
];

// GET API
app.get("/api/recipes", (req, res) => {
    res.json(recipes);
});

app.listen(port, () => {
    console.log("App listening on port: " + port);
});