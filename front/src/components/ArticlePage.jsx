import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleById } from "../services/api";

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
  }, []);


  const fetchArticle = async () => {
    try {
      setLoading(true);

      const found = await getArticleById(id);
      if (found) {
        setArticle(found);
        setError("");
      } else {
        setArticle(null);
        setError("Article not found.");
      }
    } catch (err) {
      setError("Failed to fetch article.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>No article found.</div>;

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
      <div>
        <strong>Journalist:</strong>{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/journalists/${article.journalistId}/articles`)}
        >
          {article.journalist}
        </span>
      </div>
      <div>
        <strong>Category:</strong>{" "}
        {article.categories && article.categories.length > 0 && article.categories[0]
          ? article.categories.map((cat, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  marginRight: 8,
                  padding: "0.2em 1em",
                  borderRadius: "16px",
                  background: "#f5f5f5",
                  border: "1px solid #bbb",
                  fontSize: "0.95em",
                  letterSpacing: "1px"
                }}
              >
                {cat}
              </span>
            ))
          : <span style={{ color: "#bbb" }}>No Category</span>
        }
      </div>
    </div>
  );
}
