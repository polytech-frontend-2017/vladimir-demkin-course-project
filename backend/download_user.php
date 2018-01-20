<?php
	header('Access-Control-Allow-Origin: *');
	include_once 'config.php';
	$user = $_GET['user'];
	$url = 'http://ws.audioscrobbler.com/2.0/';
	$res = [];
	$ch  = curl_init(); 
	$data = 'method=user.getInfo';
	$data.= '&api_key=' . $apikey; 
	$data.='&user='.$user;
	$data.='&autocorrect=1';
	$data.='&format=json';
	$url = $url.'?'.$data;


	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 	

	$res = json_decode(curl_exec($ch));
	curl_close($ch); 
	if(isset($res->error) ) echo $res->message;
	else{
		$db = mysqli_connect($host, $login, $pass, $base);
		if($db){
			if ($db->connect_errno) {
				echo "Не удалось подключиться к MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
			}
			else{
				$query = mysqli_query($db, generateInsertUser($res));	
				if($db->error) echo $db->error;
				usleep(200000);	
			}
		}
		$username = $res->user->name;
		$userpic = '';
		$images = $res->user->image;
		foreach($images as $image){
			if($image->size=="extralarge") $userpic = $image->{'#text'};
		}
		$ret['username'] = $username;
		$ret['image'] = $userpic;
		echo json_encode($ret);
	}

	 


	function generateInsertUser($res){
		$username = $res->user->name;
		$userpic = '';
		$images = $res->user->image;
		foreach($images as $image){
			if($image->size=="extralarge") $userpic = $image->{'#text'};
		}
		$res = "INSERT IGNORE INTO user (username, image) VALUES (\"$username\", \"$userpic\");";
		return $res;
	}
?>
