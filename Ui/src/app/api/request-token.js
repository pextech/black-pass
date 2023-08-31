// pages/api/request-token.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Cookie", "guest_id=v1%3A169156657496486558; lang=en");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch("https://api.twitter.com/oauth/request_token?oauth_consumer_key=PdsgGBkiP90VqoCsR6EhqQTby&oauth_token=187175573-fgyG0AfIEa0GO3kXuGIRcCQgjU0GkOaRTfi707j1&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1693410483&oauth_nonce=KiFAvcPVK0b&oauth_version=1.0&oauth_signature=1ejL5nrl5hgJpxctTnmBW%2FIYp3A%3D", requestOptions);
    const result = await response.text();

    res.status(response.status).send(result);
  } catch (error) {
    console.error('Error fetching request token:', error);
    res.status(500).send('Error fetching request token');
  }
}
