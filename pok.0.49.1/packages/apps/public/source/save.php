<?php
     header('Access-Control-Allow-Origin:*');
     //ini_set("display_errors", "stderr");  //ini_set函数作用：为一个配置选项设置值，
     //error_reporting(E_ALL);     //显示所有的错误信息

     define('DS', DIRECTORY_SEPARATOR);
     define('ORIGIN_FILE_NAME','origin');
     define('ORIGIN_PANO_NAME','pano');
     define('PATH_SALT','saltme,222');
     
     class source{
          public function savePano($file,$path,$name){
               $npath=$path.$name.DS;
               $this->createFolder($npath);
               $target=$npath.ORIGIN_PANO_NAME.'.zip';
               if(copy($file,$target)){
                    $zip = new ZipArchive;
                    if ($zip->open($target) === true){
                         $zip->extractTo($npath);
                         $zip->close();
                         return TRUE;
                    }else{
                         return FALSE;
                    }
               }
          }
          
          public function saveModule($file,$path,$name,$extion){
               //echo 'file:'.json_encode($file);
               
               switch ($extion) {
                    case 'zip':
                         $npath=$path.$name.DS;
                         $this->createFolder($npath);
                         $target=$npath.ORIGIN_FILE_NAME.$extion;
                         if(copy($file,$target)){
                              $zip = new ZipArchive;
                              if ($zip->open($target) === true){
                                   $zip->extractTo($npath);
                                   $zip->close();
                                   return TRUE;
                              }else{
                                   return FALSE;
                              }
                         }
                         
                         break;
                    case 'fbx':
                         $this->createFolder($path);
                         $target=$path.$name.'.'.$extion;
                         if(copy($file,$target)){
                              return true;
                         }

                         //move_uploaded_file
                         break;
                    default:
                         # code...
                         break;
               }

               
               // if(file_put_contents($name,json_encode($file)){
               //      //return true;


               // }
               // return false;

               //echo json_encode($_FILES);
          }

          public function saveBase64Image($file,$path,$name){
               $this->createFolder($path);
               $base64=$this->imgToBase64($file);
               if(preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64, $result)){	
                    $type = $result[2];		//图像的类型
                    //if($type=='jpeg')$type='jpg';
                    $name.='.'.$type;
                    $new_file = $path.$name;
                    if(file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64)))){
                         return $type;
                    }else{
                         return FALSE;
                    }
               }
               return FALSE;
          }

          public function calcPath($hash,$dep=4,$start=0,$step=2){
               $f='';
               for($i=0;$i<$dep;$i++)$f.=substr($hash,$start+$i*$step,$step).DS;
               return $f;
          }

          private function imgToBase64($file){
			if(!file_exists($file)) return FALSE;
			$type=$this->getImageType($file);
			if(empty($type)) return FALSE;
			
			//1.读取文件内容
		    $fp = fopen($file, "r"); 							// 图片是否可读权限
			if(empty($fp)) return FALSE;
			$ctx = fread($fp, filesize($file));							//读取文件内容
			fclose($fp);
			
		    return 'data:image/' . $type . ';base64,' . chunk_split(base64_encode($ctx)); 		//返回图片的base64
          }

          private function getImageType($file){
			$type='';
			$info = getimagesize($file); 		// 取得图片的大小，类型等
			switch ($info[2]) {           //判读图片类型
				case 1:
					$type = "gif";
					break;
				case 2:
					$type = "jpg";
					break;
				case 3: 
					$type = "png";
				break;
			}
			return $type;
		}
     
          private function createFolder($path){
               if (!file_exists($path)) {
                    $this -> createFolder(dirname($path));
                    mkdir($path, 0777);
                    return true;
               }
          }
     }

     $result=array(
          'success'=>false,
     );

     $a=new source();
     //$path=$a->calcPath($_POST['hash']);
     $path=$a->calcPath(md5($_POST['hash'].PATH_SALT));
     $cat=isset($_GET['cat'])?$_GET['cat']:'texture';

     switch ($cat) {
          case 'texture':
               if($a->saveBase64Image($_FILES[$_POST['file_key']]['tmp_name'],$path,$_POST['hash'])){
                    $result['success']=true;
               }
               break;
          case 'module':
               $name=$_FILES[$_POST['file_key']]['name'];
               $tmp=explode('.',$name);
               //echo json_encode($tmp);
               $extion=strtolower($tmp[count($tmp)-1]);
               if($a->saveModule($_FILES[$_POST['file_key']]['tmp_name'],$path,$_POST['hash'],$extion)){
                   $result['success']=true;
               }
               break;
           case 'pano':
               if($a->savePano($_FILES[$_POST['file_key']]['tmp_name'],$path,$_POST['hash'])){
                  $result['success']=true;
               }
               break;
          default:
               if($a->saveBase64Image($_FILES[$_POST['file_key']]['tmp_name'],$path,$_POST['hash'])){
                    $result['success']=true;
               }
               break;
     }
     
     
     exit(json_encode($result));