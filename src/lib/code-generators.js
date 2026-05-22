export function generatePython(endpoint, apiKey = 'YOUR_API_KEY') {
  const { method, baseUrl, path, sampleBody } = endpoint;
  const url = `${baseUrl}${path}`;
  const hasBody = method !== 'GET' && sampleBody;
  const bodyStr = hasBody ? JSON.stringify(sampleBody, null, 4)
    .split('\n').map((l, i) => i === 0 ? l : `        ${l}`).join('\n') : null;

  return `import requests

url = "${url}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
${hasBody ? `\npayload = ${bodyStr}\n\nresponse = requests.${method.toLowerCase()}(url, json=payload, headers=headers)` : `\nresponse = requests.${method.toLowerCase()}(url, headers=headers)`}
print(response.status_code)
print(response.json())`;
}

export function generateJavaScript(endpoint, apiKey = 'YOUR_API_KEY') {
  const { method, baseUrl, path, sampleBody } = endpoint;
  const url = `${baseUrl}${path}`;
  const hasBody = method !== 'GET' && sampleBody;
  const bodyStr = hasBody ? JSON.stringify(sampleBody, null, 2)
    .split('\n').map((l, i) => i === 0 ? l : `    ${l}`).join('\n') : null;

  return `const response = await fetch("${url}", {
  method: "${method}",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  }${hasBody ? `,\n  body: JSON.stringify(${bodyStr})` : ''}
});

const data = await response.json();
console.log(data);`;
}

export function generateGo(endpoint, apiKey = 'YOUR_API_KEY') {
  const { method, baseUrl, path, sampleBody } = endpoint;
  const url = `${baseUrl}${path}`;
  const hasBody = method !== 'GET' && sampleBody;

  const bodySection = hasBody
    ? `payload := strings.NewReader(\`${JSON.stringify(sampleBody)}\`)

  req, err := http.NewRequest("${method}", "${url}", payload)`
    : `req, err := http.NewRequest("${method}", "${url}", nil)`;

  return `package main

import (
  "fmt"
  "io"
  "net/http"${hasBody ? '\n  "strings"' : ''}
)

func main() {
  ${bodySection}
  if err != nil {
    panic(err)
  }

  req.Header.Set("Authorization", "Bearer ${apiKey}")
  req.Header.Set("Content-Type", "application/json")

  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)
  fmt.Println(resp.Status)
  fmt.Println(string(body))
}`;
}

export function generateRuby(endpoint, apiKey = 'YOUR_API_KEY') {
  const { method, baseUrl, path, sampleBody } = endpoint;
  const url = `${baseUrl}${path}`;
  const hasBody = method !== 'GET' && sampleBody;
  const bodyStr = hasBody ? JSON.stringify(sampleBody) : null;

  return `require 'net/http'
require 'json'
require 'uri'

uri = URI("${url}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::${method.charAt(0) + method.slice(1).toLowerCase()}.new(uri)
request["Authorization"] = "Bearer ${apiKey}"
request["Content-Type"] = "application/json"
${hasBody ? `request.body = '${bodyStr}'\n` : ''}
response = http.request(request)
puts response.code
puts JSON.parse(response.body)`;
}

export function generatePhp(endpoint, apiKey = 'YOUR_API_KEY') {
  const { method, baseUrl, path, sampleBody } = endpoint;
  const url = `${baseUrl}${path}`;
  const hasBody = method !== 'GET' && sampleBody;
  const bodyStr = hasBody ? JSON.stringify(sampleBody) : null;

  return `<?php

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${url}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "${method}",
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${apiKey}",
    "Content-Type: application/json"
  ],${hasBody ? `\n  CURLOPT_POSTFIELDS => '${bodyStr}',` : ''}
]);

$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

echo $httpCode . "\\n";
echo $response . "\\n";`;
}