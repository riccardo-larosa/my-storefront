import { type NextRequest } from 'next/server'


async function getToken() {

    const clientid = process.env.CLIENTID; 
    const clientsecret = process.env.CLIENTSECRET;
    if (!clientid || !clientsecret) {
        throw new Error('CLIENTID and CLIENTSECRET must be defined in environment variables');
    }
    // Create URLSearchParams for form-encoded data
    const data = new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': clientid,
        'client_secret': clientsecret
    } as Record<string, string>);

    // Using fetch to make the POST request
    const url = process.env.API_BASE_URL;
    const response = await fetch(`${url}/oauth/access_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: data // Send the form-encoded data in the body
    })
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const results = await response.json();
    return results.access_token;
    
}
export async function GET(request: NextRequest) {

    const params = request.nextUrl.searchParams;
    const content_id = params.get('content_id');
    const token = await getToken();
    const base_url = process.env.API_BASE_URL;
    //console.log(token);
    const url_str = `${base_url}/v2/extensions/store-content?filter=like(content_id,${content_id})`;
    console.log(`url_str: ${url_str}`);
    const response = await fetch(
        url_str,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            //cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    // if data.data is not empty, then return the first entry   
    const pageContent = data.data.length > 0 ? data.data[0] : null;
    return Response.json(pageContent);
}