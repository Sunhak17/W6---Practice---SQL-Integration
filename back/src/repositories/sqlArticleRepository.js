//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
//  - Perform the SQL queries to implement the below API
//
import { pool } from '../utils/database.js';

// Get all articles
export async function getArticles() {
  const [rows] = await pool.query(`
    SELECT 
      a.id, a.title, a.content, a.journalist_id,
      j.name AS journalist,
      GROUP_CONCAT(c.name) AS categories
    FROM articles a
    LEFT JOIN journalists j ON a.journalist_id = j.id
    LEFT JOIN article_categories ac ON a.id = ac.article_id
    LEFT JOIN categories c ON ac.category_id = c.id
    GROUP BY a.id
  `);
  // Convert categories string to array
  return rows.map(row => ({
    ...row,
    categories: row.categories ? row.categories.split(',') : []
  }));
}

// Get one article by ID
export async function getArticleById(id) {
  const [rows] = await pool.query(`
    SELECT 
      a.id, a.title, a.content, a.journalist_id,
      j.name AS journalist,
      GROUP_CONCAT(c.name) AS categories
    FROM articles a
    LEFT JOIN journalists j ON a.journalist_id = j.id
    LEFT JOIN article_categories ac ON a.id = ac.article_id
    LEFT JOIN categories c ON ac.category_id = c.id
    WHERE a.id = ?
    GROUP BY a.id
  `, [id]);
  if (!rows[0]) return null;
  return {
    ...rows[0],
    categories: rows[0].categories ? rows[0].categories.split(',') : []
  };
}

// Create a new article
export async function createArticle(article) {
    const { title, content, journalistId, categoryId } = article;
    const [result] = await pool.query(
        'INSERT INTO articles (title, content, journalist_id, category_id) VALUES (?, ?, ?, ?)',
        [title, content, journalistId, categoryId]
    );
    return { id: result.insertId, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    const { title, content, journalistId, categoryId } = updatedData;
    await pool.query(
        'UPDATE articles SET title = ?, content = ?, journalist_id = ?, category_id = ? WHERE id = ?',
        [title, content, journalistId, categoryId, id]
    );
    return { id, ...updatedData };
}

// Delete an article by ID
export async function deleteArticle(id) {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
    return { id };
}

// Get one article along with journalist info (via JOIN)
export async function getArticleWithJournalist(id) {
    const [rows] = await pool.query(`
        SELECT 
            a.id, a.title, a.content, a.journalist_id,
            j.name AS journalist_name, j.email, j.bio
        FROM articles a
        JOIN journalists j ON a.journalist_id = j.id
        WHERE a.id = ?
    `, [id]);
    return rows[0]; // return single article or undefined
}

// Get all articles written by a specific journalist
export async function getArticlesByJournalist(journalistId) {
    const [rows] = await pool.query(`
        SELECT 
            a.id, a.title, a.content, a.journalist_id,
            j.name AS journalist_name
        FROM articles a
        JOIN journalists j ON a.journalist_id = j.id
        WHERE j.id = ?
    `, [journalistId]);
    return rows;
}

// Get all categories
export async function getAllCategories() {
  const [rows] = await pool.query('SELECT * FROM categories');
  return rows;
}

// Get articles by category ID (with category name)
export async function getArticlesByCategory(categoryId) {
  const [rows] = await pool.query(`
    SELECT 
      a.id, a.title, a.content, a.journalist_id,
      j.name AS journalist,
      GROUP_CONCAT(c.name) AS categories
    FROM articles a
    LEFT JOIN journalists j ON a.journalist_id = j.id
    LEFT JOIN article_categories ac ON a.id = ac.article_id
    LEFT JOIN categories c ON ac.category_id = c.id
    WHERE a.id IN (
      SELECT article_id FROM article_categories WHERE category_id = ?
    )
    GROUP BY a.id
  `, [categoryId]);
  return rows.map(row => ({
    ...row,
    categories: row.categories ? row.categories.split(',') : []
  }));
}
