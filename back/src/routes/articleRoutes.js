import { Router } from "express";
import { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle, fetchArticleWithJournalist, fetchArticlesByJournalist, getAllCategories, getArticlesByCategory } from "../controllers/articleController.js";

const articleRouter = Router();

articleRouter.get("/with-journalist/:id", fetchArticleWithJournalist);
articleRouter.get("/by-journalist/:id", fetchArticlesByJournalist);
articleRouter.get("/categories", getAllCategories);
articleRouter.get("/by-category/:categoryId", getArticlesByCategory);

articleRouter.get("/", getAllArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.post("/", createArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.delete("/:id", deleteArticle);


export default articleRouter;
