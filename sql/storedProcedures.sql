DELIMITER $$
CREATE PROCEDURE `sp_unavagam_getAllCategories`()
BEGIN
WITH RECURSIVE hierarchy AS (
    SELECT 
        id AS child_id,
        name AS child_name,
        parent_id
    FROM 
        categories
)

SELECT 
    parent.id AS parent_id,
    parent.name AS parent_name,
    CASE 
        WHEN COUNT(child.child_id) = 0 THEN NULL  -- If no children, set to NULL
        ELSE JSON_ARRAYAGG(
            JSON_OBJECT('id', child.child_id, 'name', child.child_name)
        )
    END AS children,
    (select name from food_type_ref ftr where parent.type_id = ftr.id) as type
FROM 
    categories AS parent
LEFT JOIN 
    hierarchy AS child ON parent.id = child.parent_id AND child.child_name IS NOT NULL
GROUP BY 
    parent.id, parent.name;


END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_unavagam_getAllClients`()
BEGIN
select C.*, count(S.client_id) as countOfShops from clients C left join shops S on S.client_id = C.id group by C.id;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_unavagam_getAllMenuProducts`(IN pMenuId INT)
BEGIN
SELECT MP.menu_id, P.id, P.name,P.price,P.description,P.stock FROM menu_products MP
join products P on P.id = MP.product_id where MP.menu_id= pMenuId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `sp_unavagam_getAllShopsUser`(IN pShopId INT, IN pRoleId INT)
BEGIN

SET @sqlQuery = CONCAT("SELECT U.id, U.first_name, U.last_name, U.email, U.phone_number as phoneNumber,
U.last_active as lastActive, CASE WHEN U.role_id = 0 or U.role_id is NULL 
THEN SU.role_id 
ELSE U.role_id END roleId 
FROM users U join shop_users SU on SU.user_id = U.id where SU.shop_id = ",pShopId," and U.status = 1");

 IF pRoleId IS NOT NULL and pRoleId = 1 then
     set @sqlQuery =CONCAT("SELECT U.id, U.first_name, U.last_name, U.email, U.phone_number as phoneNumber,
U.last_active as lastActive, CASE WHEN U.role_id = 0 or U.role_id is NULL 
THEN SU.role_id 
ELSE U.role_id END roleId 
FROM users U left join shop_users SU on SU.user_id = U.id where (SU.shop_id =",pShopId," or U.role_id = 1 or U.role_id = 2) 
and U.status = 1");
END IF;

 IF pRoleId IS NOT NULL and pRoleId = 2 then
     set @sqlQuery =CONCAT("SELECT U.id, U.first_name, U.last_name, U.email, U.phone_number as phoneNumber,
U.last_active as lastActive, CASE WHEN U.role_id = 0 or U.role_id is NULL 
THEN SU.role_id 
ELSE U.role_id END roleId 
FROM users U left join shop_users SU on SU.user_id = U.id where (SU.shop_id =",pShopId," or U.role_id = 2) and U.status = 1");
END IF;

 PREPARE stmt FROM @sqlQuery;
    EXECUTE stmt;
    DEALLOCATE PREPARE  stmt;
END$$
DELIMITER ;
