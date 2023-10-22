<?php
$message = $_POST['question'];
// echo 'hello';
// $message = "Hello, i am providing you all my health related issues together with my records,
//  analyse it and provide me with an educational analysis.
//  The health records are below seperated with ;I get Headaches every day";
// echo $message;
$api_key = "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";
$url = "https://api.openai.com/v1/chat/completions";
$data = array(
    "model" => "gpt-3.5-turbo",
    "messages" => array(array("role" => "user", "content" => $message)),
    //"temperature" => 0.7
);

$data_string = json_encode($data);



$ch = curl_init($url);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Authorization: Bearer " . $api_key
));

$result = curl_exec($ch);
curl_close($ch);

// Parse the JSON response
$responseData = json_decode($result, true);

// Extract the "content" part
$content = $responseData['choices'][0]['message']['content'];

echo $content;
?>
