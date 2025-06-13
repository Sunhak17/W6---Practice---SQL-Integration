import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getArticlesByJournalist } from "../services/api";

export default function JournalistArticles() {
  const { journalistId } = useParams();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getArticlesByJournalist(journalistId);
      setArticles(data);
      setIsLoading(false);
    }
    fetchData();
  }, [journalistId]);

  return (
    <div>
      <h2>Articles by Journalist #{journalistId}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} onClick={() => navigate(`/articles/${article.id}`)}>
            {article.title}
          </div>
        ))
      )}
    </div>
  );
}