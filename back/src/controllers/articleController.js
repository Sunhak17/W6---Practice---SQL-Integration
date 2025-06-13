import * as articleRepository from "../repositories/sqlArticleRepository.js";


// TODO : Change articleRepository to use the sqlArticleRepository

// GET /api/articles
export async function getAllArticles(req, res) {
  try {
    const articles = await articleRepository.getArticles();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/:id
export async function getArticleById(req, res) {
  try {
    const article = await articleRepository.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getAllCategories(req, res) {
  try {
    const categories = await articleRepository.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getArticlesByCategory(req, res) {
  try {
    const articles = await articleRepository.getArticlesByCategory(req.params.categoryId);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/articles
export async function createArticle(req, res) {
  try {
    const newArticle = await articleRepository.createArticle(req.body);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/articles/:id
export async function updateArticle(req, res) {
  try {
    const updatedArticle = await articleRepository.updateArticle(
      req.params.id,
      req.body
    );
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/articles/:id
export async function deleteArticle(req, res) {
  try {
    await articleRepository.deleteArticle(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/with-journalist/:id
export async function fetchArticleWithJournalist(req, res) {
  try {
    // You should implement getArticleWithJournalist in your SQL repository
    const article = await articleRepository.getArticleWithJournalist(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    console.error("Error fetching article with journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/articles/by-journalist/:id
export async function fetchArticlesByJournalist(req, res) {
  try {
    // You should implement getArticlesByJournalist in your SQL repository
    const articles = await articleRepository.getArticlesByJournalist(req.params.id);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by journalist:", error);
    res.status(500).json({ message: "Server error" });
  }
}