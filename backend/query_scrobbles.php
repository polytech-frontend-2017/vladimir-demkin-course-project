<?php
	header('Access-Control-Allow-Origin: *');
	include_once 'config.php';
	
	$db = mysqli_connect($host, $login, $pass, $base);
	$user =  mysqli_real_escape_string($db, $_GET['user']);
	$startdate = mysqli_real_escape_string($db, $_GET['startdate']);
	$enddate = mysqli_real_escape_string($db, $_GET['enddate']);
	$code = mysqli_real_escape_string($db, $_GET['code']);
		if($db){
			if ($db->connect_errno) {
				echo "Не удалось подключиться к MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
			}
			else{
				mysqli_set_charset($db, 'UTF8');
				switch($code){
					case 1:
						$query = "SELECT artist as name, count(track) as value
								  FROM scrobble
								  WHERE user = \"$user\" AND scrobbletime+0 BETWEEN \"$startdate\"+0 AND \"$enddate\"+0
								  GROUP BY artist
								  ORDER BY 2 DESC
								  LIMIT 15 ;";
								  break;
					case 2:
						$query = "SELECT CONCAT(artist,\" - \", album) as name, count(track) as value
								  FROM scrobble 
								  WHERE user = \"$user\" AND scrobbletime+0 BETWEEN \"$startdate\"+0 AND \"$enddate\"+0 AND LENGTH(album)>0
								  GROUP BY artist, album
								  ORDER BY 2 DESC
								  LIMIT 15 ;";
								  break;
					case 3:
						$query = "SELECT CONCAT(artist,\" - \", track) as name, count(track) as value
								  FROM scrobble
								  WHERE user = \"$user\" AND scrobbletime+0 BETWEEN \"$startdate\"+0 AND \"$enddate\"+0
								  GROUP BY artist, track
								  ORDER BY 2 DESC
								  LIMIT 15 ;";
								  break;

				}
				$qres = mysqli_query($db, $query);
				$res = mysqli_fetch_all($qres, MYSQLI_ASSOC);
				$ans = json_encode($res, JSON_UNESCAPED_UNICODE);
				echo $ans;
			}
		}
	
	mysqli_close($db);
	
	
?>

