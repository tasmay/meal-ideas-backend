const recipesRouter = require('express').Router()
const db = require('../db')
const format = require('pg-format');

recipesRouter.get('/featured', (req, res, next) => {
    let queryText = `SELECT recipe_id AS id, title, url, category_id,
    (SELECT name FROM categories WHERE categories.category_id = recipes.category_id) AS category,
    description,
    created_date AS date,
    image_url,
    reading_time,
    (SELECT name FROM authors WHERE authors.author_id = recipes.author_id) AS author_name,
    (SELECT url FROM authors WHERE authors.author_id = recipes.author_id) AS author_url,
    (SELECT image_url FROM authors WHERE authors.author_id = recipes.author_id) AS author_image,
    featured AS featuredpost,
    '' AS cuisine,
    '' AS meal,
    cooking_time AS time,
    vegan AS v,
    gluten_free AS g,
    vegetarian AS veg,
    allergy_friendly AS a
    FROM recipes WHERE featured=true limit 3`
    db.query(queryText, (err, result) => {
        if (err) {
          return next(err)
        }
        res.send(result.rows)
    })
})

recipesRouter.get('/search', (req, res, next) => {
    let whereClause = 'true'
    if (req.query.m)
        whereClause = whereClause.concat(format(' AND rm.meal_id = %L', req.query.m))
    if (req.query.c)
        whereClause = whereClause.concat(format(' AND rc.cuisine_id = %L', req.query.c))
    if (req.query.time)
        whereClause = whereClause.concat(format(' AND r.cooking_time <= %L', req.query.time))
    if (req.query.v)
        whereClause = whereClause.concat(format(' AND r.vegan = %L', req.query.v))
    if (req.query.g)
        whereClause = whereClause.concat(format(' AND r.gluten_free = %L', req.query.g))
    if (req.query.veg)
        whereClause = whereClause.concat(format(' AND r.vegetarian = %L', req.query.veg))
    if (req.query.a)
        whereClause = whereClause.concat(format(' AND r.allergy_friendly = %L', req.query.a))
    if(req.query.ingredients) {
        ingr_array = req.query.ingredients
        whereClause = whereClause.concat(format(` AND ingr.keywords && ARRAY[%L]`, ingr_array))
    }
    let sql = format(`SELECT 
            r.recipe_id AS id, 
            r.title AS title, 
            r.url AS url, 
            r.category_id AS category_id,
            (SELECT name FROM categories WHERE categories.category_id = r.category_id) AS category,
            r.description,
            r.created_date AS date,
            r.image_url,
            r.reading_time,
            (SELECT name FROM authors WHERE authors.author_id = r.author_id) AS author_name,
            (SELECT url FROM authors WHERE authors.author_id = r.author_id) AS author_url,
            (SELECT image_url FROM authors WHERE authors.author_id = r.author_id) AS author_image,
            r.featured AS featuredpost,
            (SELECT name FROM cuisines WHERE cuisines.cuisine_id = rc.cuisine_id) AS cuisine,
            (SELECT name FROM meals WHERE meals.meal_id = rm.meal_id) AS meal,
            string_agg(ingr.name, ', ') AS ingredients,
            r.cooking_time AS time,
            r.vegan AS v,
            r.gluten_free AS g,
            r.vegetarian AS veg,
            r.allergy_friendly AS a
        FROM recipes r
        INNER JOIN recipes_meals rm on rm.recipe_id = r.recipe_id
        INNER JOIN recipes_cuisines rc on rc.recipe_id = r.recipe_id
        INNER JOIN recipes_ingredients ri on ri.recipe_id = r.recipe_id
        INNER JOIN ingredients ingr on ingr.ingredient_id = ri.ingredient_id
        WHERE %s
        GROUP BY r.recipe_id, rc.cuisine_id, rm.meal_id`, whereClause)
    console.log(sql)
    db.query(sql, (err, result) => {
        if (err) {
          return next(err)
        }
        res.send(result.rows)
    })
})

recipesRouter.get('/:id', (req, res, next) => {
    let sql = format(`SELECT recipe_id AS id, title, url, category_id,
    (SELECT name FROM categories WHERE categories.category_id = recipes.category_id) AS category,
    description,
    created_date AS date,
    image_url,
    reading_time,
    (SELECT name FROM authors WHERE authors.author_id = recipes.author_id) AS author_name,
    (SELECT url FROM authors WHERE authors.author_id = recipes.author_id) AS author_url,
    (SELECT image_url FROM authors WHERE authors.author_id = recipes.author_id) AS author_image,
    featured AS featuredpost,
    '' AS cuisine,
    '' AS meal,
    cooking_time AS time,
    vegan AS v,
    gluten_free AS g,
    vegetarian AS veg,
    allergy_friendly AS a
    FROM recipes WHERE recipe_id = %L`, req.params.id)
    console.log(sql)
    db.query(sql, (err, result) => {
        if (err) {
          return next(err)
        }
        res.send(result.rows[0])
    })
})

recipesRouter.get('/category/:id', (req, res, next) => {
    let sql = format(`SELECT recipe_id AS id, title, url, category_id,
    (SELECT name FROM categories WHERE categories.category_id = recipes.category_id) AS category,
    description,
    created_date AS date,
    image_url,
    reading_time,
    (SELECT name FROM authors WHERE authors.author_id = recipes.author_id) AS author_name,
    (SELECT url FROM authors WHERE authors.author_id = recipes.author_id) AS author_url,
    (SELECT image_url FROM authors WHERE authors.author_id = recipes.author_id) AS author_image,
    featured AS featuredpost,
    '' AS cuisine,
    '' AS meal,
    cooking_time AS time,
    vegan AS v,
    gluten_free AS g,
    vegetarian AS veg,
    allergy_friendly AS a
    FROM recipes WHERE recipes.category_id = %L`, req.params.id)
    console.log(sql)
    db.query(sql, (err, result) => {
        if (err) {
          return next(err)
        }
        res.send(result.rows)
    })
})

recipesRouter.get('/', (req, res, next) => {
    let sql = `SELECT recipe_id AS id, title, url, category_id,
        (SELECT name FROM categories WHERE categories.category_id = recipes.category_id) AS category,
        description,
        created_date AS date,
        image_url,
        reading_time,
        (SELECT name FROM authors WHERE authors.author_id = recipes.author_id) AS author_name,
        (SELECT url FROM authors WHERE authors.author_id = recipes.author_id) AS author_url,
        (SELECT image_url FROM authors WHERE authors.author_id = recipes.author_id) AS author_image,
        featured AS featuredpost,
        '' AS cuisine,
        '' AS meal,
        cooking_time AS time,
        vegan AS v,
        gluten_free AS g,
        vegetarian AS veg,
        allergy_friendly AS a
    FROM recipes`
    console.log(sql)
    db.query(sql, (err, result) => {
      if (err) {
        return next(err)
      }
      res.send(result.rows)
    })
})

module.exports = recipesRouter