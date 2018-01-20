<?php
	header('Access-Control-Allow-Origin: *');
	include_once 'config.php';
	

	$db = mysqli_connect($host, $login, $pass, $base);
	
		if($db){
			if ($db->connect_errno) {
				echo "Не удалось подключиться к MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
			}
			else{
				$user = mysqli_real_escape_string($db, $_GET['user']);
				mysqli_set_charset($db, 'UTF8');
				
					$query = "SELECT username, image
							  FROM user
							  WHERE username LIKE \"%$user%\" 
							  ORDER BY LENGTH(username) ASC;
							  ";
			
				$qres = mysqli_query($db, $query);
				$res = mysqli_fetch_all($qres, MYSQLI_ASSOC);
				$ans = json_encode($res, JSON_UNESCAPED_UNICODE);
				echo $ans;
			}
		}
	
	mysqli_close($db);
	
	
?>

