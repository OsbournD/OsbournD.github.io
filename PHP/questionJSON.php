<?php
header('Content-Type: application/json');

$directory = '../JSON/';

//Get all JSON files in the directory
$files = glob($directory . '*.json');

//Extract just the filenames without the directory path
$filenames = array_map(function($path) {
    return basename($path);
}, $files);

//Return the filenames as JSON
echo json_encode($filenames);
?>