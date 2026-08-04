require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Recipe schema
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Recipe model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Sample data
const sampleRecipes = [
  {
    title: "Chicken Biryani",
    image:
      "https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=600",
    description:
      "A delicious Indian rice dish cooked with chicken, spices and herbs.",
  },
  {
    title: "Veg Pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600",
    description:
      "Creamy vegetable pasta loaded with fresh vegetables and herbs.",
  },
  {
    title: "Chocolate Cake",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
    description:
      "Soft and rich chocolate cake perfect for every celebration.",
  },
];

// Add sample recipes only when the database is empty
const insertSampleRecipes = async () => {
  const recipeCount = await Recipe.countDocuments();

  if (recipeCount === 0) {
    await Recipe.insertMany(sampleRecipes);
    console.log("Sample recipes added to MongoDB");
  } else {
    console.log("Recipes already exist in MongoDB");
  }
};

// GET all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Failed to retrieve recipes:", error.message);

    res.status(500).json({
      message: "Failed to retrieve recipes",
    });
  }
});

// POST a new recipe
app.post("/api/recipes", async (req, res) => {
  try {
    const { title, image, description } = req.body;

    if (!title || !image || !description) {
      return res.status(400).json({
        message: "Title, image and description are required",
      });
    }

    const newRecipe = new Recipe({
      title,
      image,
      description,
    });

    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error("Failed to add recipe:", error.message);

    res.status(500).json({
      message: "Failed to add recipe",
    });
  }
});

// Start server after MongoDB connection
const startServer = async () => {
  try {
    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const host = process.env.MONGO_HOST;

    if (!username || !password || !host) {
      throw new Error(
        "MongoDB username, password or host is missing from the .env file."
      );
    }

    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);

    const mongoURI =
      `mongodb+srv://${encodedUsername}:${encodedPassword}` +
      `@${host}/recipeExplorer` +
      `?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully");

    await insertSampleRecipes();

    app.listen(port, () => {
      console.log("App listening on port: " + port);
      console.log("Open http://localhost:" + port);
    });
  } catch (error) {
    console.error("Server failed to start:");
    console.error(error.message);
  }
};

startServer();