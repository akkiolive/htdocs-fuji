<?php

$json = $_POST["json"];
file_put_contents("../userdata/data.json", $json);
echo $json;
?>