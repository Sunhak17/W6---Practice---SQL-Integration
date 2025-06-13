import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArticles, removeArticle, getAllCategories, getArticlesByCategory } from "../services/api";

//
// ArticleList component
//
export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles(); 
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      fetchArticles();
    } else {
      fetchArticlesByCategories(selectedCategories);
    }
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      setError("Failed to load articles. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticlesByCategories = async (categoryIds) => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch articles for each selected category and merge results
      const results = await Promise.all(
        categoryIds.map((id) => getArticlesByCategory(id))
      );
      // Flatten and remove duplicates
      const merged = [].concat(...results);
      const unique = Array.from(new Map(merged.map(a => [a.id, a])).values());
      setArticles(unique);
    } catch (err) {
      setError("Failed to load filtered articles.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    setIsLoading(true);
    setError("");
    try {
      await removeArticle(id);
      if (selectedCategories.length === 0) {
        await fetchArticles();
      } else {
        await fetchArticlesByCategories(selectedCategories);
      }
    } catch (err) {
      setError("Failed to delete article.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (id) => navigate(`/articles/${id}`);
  const handleEdit = (id) => navigate(`/articles/${id}/edit`);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="article-list">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={deleteArticle}
          />
        ))}
      </div>
    </>
  );
}

function ArticleCard({ article, onView, onEdit, onDelete }) {
  const categories = Array.isArray(article.categories)
    ? article.categories
    : article.category
      ? [article.category]
      : [];

  return (
    <div className="article-card">
      <div className="article-title">{article.title}</div>
      <div className="article-author">By {article.journalist || <span style={{ color: "#bbb" }}>Unknown</span>}</div>
      <p style={{ fontSize: "0.92em", color: "#444" }}>{article.content}</p>
      <div style={{ display: "flex", gap: "0.5em", margin: "0.5em 0" }}>
        {categories.length > 0 && categories[0]
          ? categories.map((cat, idx) => (
              <span
                key={idx}
                style={{
                  padding: "0.2em 1em",
                  borderRadius: "16px",
                  background: "#f5f5f5",
                  border: "1px solid #bbb",
                  fontSize: "0.95em",
                  letterSpacing: "1px"
                }}
              >
                {cat.toUpperCase()}
              </span>
            ))
          : <span style={{ color: "#bbb" }}>No Category</span>
        }
      </div>
        

      <div className="article-actions">
        <button className="button-tertiary" onClick={() => onEdit(article.id)}>
          Edit
        </button>
        <button className="button-tertiary" onClick={() => onDelete(article.id)}>
          Delete
        </button>
        <button className="button-secondary" onClick={() => onView(article.id)}>
          View
        </button>
      </div>
    </div>
  );
}