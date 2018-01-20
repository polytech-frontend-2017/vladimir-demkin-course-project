<?php
	header('Access-Control-Allow-Origin: *');
	include_once 'config.php';
	$user = $_GET['user'];

	$db = mysqli_connect($host, $login, $pass, $base);
		if($db){
			if ($db->connect_errno) {
				echo "Не удалось подключиться к MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
			}
			else{
				mysqli_set_charset($db, 'UTF8');
				$scount = scrobbleCount($db, $user, $apikey);
				if(!$scount) echo 'Ошибка соединения с базой';
				else{
					$page =  ceil(($scount['max']-$scount['curr'])/200);
					$res =[];
					$newpage = 0;
					if($scount['max']>$scount['curr']){
							if($page >= 1) {
								usleep(200000);
								$scrobbles=queryPageScrobbles($user, $page, $apikey);
								$querytext = generateInsertScrobbles($db, $scrobbles, $user);
								$scount['max'] = $scrobbles->recenttracks->{'@attr'}->total;
								$newpage = ceil(($scrobbles->recenttracks->{'@attr'}->total-$scount['curr'])/200);
								$query = mysqli_query($db, $querytext);
								$rows = 0;
								if(!$db->error) $rows =  mysqli_affected_rows($db);
								usleep(200000);
							}
					}
					$ans = json_encode($scount);
					echo($ans);
				}
				
			}
		}
	
	mysqli_close($db);
	
	function scrobbleCount($db, $user, $apikey){
		$url = 'http://ws.audioscrobbler.com/2.0/';
		$res = [];
		$ch  = curl_init(); 
		$data = 'method=user.getRecentTracks';
		$data .= '&api_key=' . $apikey; 
		$data .= '&user='.$user;
		$data .= '&autocorrect=1';
		$data .= '&limit=200';
		$data .= '&page=1';
		$data .= '&format=json';
		$url = $url.'?'.$data;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 	

		$res = json_decode(curl_exec($ch));
		
		$query = 'SELECT COUNT(*) FROM scrobble WHERE user ="'.$user.'";';
		$qres = mysqli_query($db, $query);
		if ($db->errno) {
			return false;
		}	
		
		$pcount = mysqli_fetch_row($qres)[0];
		$cnt = [];
		$cnt['curr'] = $pcount;
		$cnt['max'] = $res->recenttracks->{'@attr'}->total;
		return $cnt;
	}
	function queryPageScrobbles($user, $page, $apikey){
		$url = 'http://ws.audioscrobbler.com/2.0/';
		$res = [];
		$ch  = curl_init(); 
		$data = 'method=user.getRecentTracks';
		$data .= '&api_key=' . $apikey; 
		$data .= '&user='.$user;
		$data .= '&autocorrect=1';
		$data .= '&limit=200';
		$data .= '&page='.$page;
		$data .= '&format=json';
		$url = $url.'?'.$data;
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 	

		$res = json_decode(curl_exec($ch));
		
		curl_close($ch); 
		return $res;
	}
	function generateInsertScrobbles($connection, $lans, $user){
		$trackarr = $lans->recenttracks->track;
		$res ='INSERT IGNORE INTO scrobble (track_mbid, scrobbletime, user, track, album, album_mbid, artist, artist_mbid) VALUES ';
		foreach($trackarr as $track){
			if(!isset($track->{'@attr'}))
			$res.='("'.			$track->mbid.
						'", "'. $track->{'date'}->uts.
						'", "'.	mysqli_real_escape_string($connection, $user).	
						'", "'.	mysqli_real_escape_string($connection, $track->name).	
						'", "'.	mysqli_real_escape_string($connection, $track->album->{'#text'}).
						'", "'.	$track->album->mbid.
						'", "'.	mysqli_real_escape_string($connection, $track->artist->{'#text'}).
						'", "'.	$track->artist->mbid.
								'"), '."\n";
		}
		return mb_substr($res,0,-3,'UTF-8').' ;';
	}
?>

