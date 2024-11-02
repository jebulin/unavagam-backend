CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unavagam_getAllClients`()
BEGIN
select C.*, count(S.client_id) as countOfShops from clients C left join shops S on S.client_id = C.id group by C.id;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_unavagam_getAllShopsUser`(IN pShopId INT, IN pRoleId INT)
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
END